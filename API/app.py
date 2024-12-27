from flask import Flask, request, jsonify, send_file, url_for
from openai import OpenAI
import requests
import json
import csv
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.image import MIMEImage

# Initialize Flask app
app = Flask(__name__)

# OpenAI API setup
base_url = "https://api.aimlapi.com/v1"
api_key = "4dd1e7c2f33a4b7ba97b03b66978b24f"
client = OpenAI(base_url=base_url, api_key=api_key)

# Helper function to validate and parse contacts
def validate_contacts(contacts):
    try:
        validated_contacts = []
        for contact in contacts:
            job_title = contact.get("job_title", "").strip()
            name = contact.get("name", "").strip()
            email = contact.get("email", "").strip()
            if not job_title or not name or not email:
                raise ValueError("Each contact must have 'job_title', 'name', and 'email'.")
            validated_contacts.append({"job_title": job_title, "name": name, "email": email})
        return validated_contacts
    except Exception as e:
        raise ValueError(f"Invalid contacts format: {str(e)}")

# Helper function to generate email templates
def generate_email_template(data):
    email_template = f"""
    You are an expert email marketing strategist using GenAI to create highly personalized email sequences.
    Generate a series of {data['number_of_emails']} emails for a drip campaign tailored to the following account details:

    Account Name: {data['account_name']}
    Industry: {data['industry']}
    Key Pain Points: {data['pain_points']}
    Campaign Objective: {data['campaign_objective']}

    Contacts:
    {json.dumps(data['contacts'], indent=2)}

    For each email use {data['language']} language:
    1. Create a subject line that grabs attention.
    2. Write a concise body within 100 words addressing the account's pain points and aligning with the campaign objective and taking in the consideration of job title and industry mentioned.
    3. Include a clear call-to-action.

    Ensure:
    - Email tone is professional yet engaging.
    - Content is customized to the specific persona and pain points.
    - The sequence progresses logically toward the campaign objective.

    Also, suggest the optimal send time for the emails based on the industry.

    Provide the output in JSON format as:

        "emails": [
            {{
                "subject": "<subject>",
                "body": "<body>",
                "call_to_action": "<call_to_action>",
                "optimal_send_time": "<optimal_send_time>",
                "image_url": "<image_url>"
            }}
        ]
    """
    return email_template

# Helper function to save emails to CSV
def save_emails_to_csv(emails):
    filename = "email_sequence.csv"
    with open(filename, mode="w", newline="", encoding="utf-8") as file:
        writer = csv.writer(file)
        writer.writerow(["Subject", "Body", "Call to Action", "Optimal Send Time", "Image Link"])

        for email in emails:
            writer.writerow([
                email.get("subject", ""),
                email.get("body", ""),
                email.get("call_to_action", ""),
                email.get("optimal_send_time", ""),
                email.get("image_url", ""),
            ])

    return filename

# Helper function to send emails
def send_email(to_email, subject, body, call_to_action, optimal_send_time, image_url):
    try:
        # Your email credentials
        smtp_server = "smtp.gmail.com"
        smtp_port = 587
        sender_email = "h57455125@gmail.com"  # Replace with your email
        sender_password = "iaph qdvw mkbk lemu"  # Replace with your password

        # Create the email
        msg = MIMEMultipart()
        msg['From'] = sender_email
        msg['To'] = to_email
        msg['Subject'] = subject

        # Add the email body with additional sections
        email_content = f"""
        <p>{body}</p>
        <br>
        <p><strong>Call to Action:</strong></p>
        <p>{call_to_action}</p>
        <br>
        <p><strong>Optimal Send Time:</strong></p>
        <p>{optimal_send_time}</p>
        """

        msg.attach(MIMEText(email_content, "html"))

        # Add the image if available
        if image_url:
            try:
                # Fetch the image from the URL
                response = requests.get(image_url)
                response.raise_for_status()
                image_data = response.content

                # Attach image to the email
                img = MIMEImage(image_data)
                img.add_header('Content-Disposition', 'attachment', filename='image.jpg')
                msg.attach(img)
            except Exception as e:
                print(f"Error attaching image: {str(e)}")

        # Send the email
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()  # Upgrade to secure connection
            server.login(sender_email, sender_password)
            server.sendmail(sender_email, to_email, msg.as_string())

        print(f"Email sent to {to_email} successfully.")
    except Exception as e:
        print(f"Error sending email: {str(e)}")

# Route to generate emails
@app.route('/generate-emails', methods=['POST'])
def generate_emails():
    try:
        data = request.get_json()

        # Validate input
        required_fields = ['account_name', 'industry', 'pain_points', 'campaign_objective', 'number_of_emails', 'language', 'contacts']
        if not all(field in data for field in required_fields):
            return jsonify({"error": "Missing required fields"}), 400

        # Validate and parse contacts
        contacts = validate_contacts(data['contacts'])
        data['contacts'] = contacts

        # Generate email template
        prompt = generate_email_template(data)

        # Get email response from OpenAI
        completion = client.chat.completions.create(
            model="gpt-4o-2024-08-06",
            messages=[
                {"role": "system", "content": "You are an AI assistant specialized in email marketing."},
                {"role": "user", "content": prompt},
            ],
            temperature=0.1,
            max_tokens=1000,
        )
        response = completion.choices[0].message.content

        # Parse response into JSON
        cleaned_response = response.strip("`json\n").strip("`")
        email_response_json = json.loads(cleaned_response)

        # Add image URLs to each email and send the emails
        for contact, email in zip(data['contacts'], email_response_json.get("emails", [])):
            image_prompt = f"Generate an image illustrating the subject: '{email['subject']}' and body: '{email['body']}'"
            image_url = generate_image(image_prompt)
            email['image_url'] = image_url

            # Send email
            send_email(
                to_email=contact['email'],
                subject=email['subject'],
                body=email['body'],
                call_to_action=email['call_to_action'],
                optimal_send_time=email['optimal_send_time'],
                image_url=image_url
            )

        # Save emails to CSV
        filename = save_emails_to_csv(email_response_json.get("emails", []))

        # Generate download link for CSV
        download_link = url_for('download_csv', filename=filename, _external=True, _scheme='https')

        return jsonify({
            "emails": email_response_json.get("emails", []),
            "download_link": download_link
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Route to download CSV
@app.route('/download-csv', methods=['GET'])
def download_csv():
    try:
        filename = request.args.get('filename', 'email_sequence.csv')
        if os.path.exists(filename):
            return send_file(filename, as_attachment=True)
        else:
            return jsonify({"error": "File not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Helper function to generate images
def generate_image(prompt):
    try:
        response = requests.post(
            f"{base_url}/images/generations",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            },
            json={"prompt": prompt, "model": "dall-e-3"},
        )
        response.raise_for_status()
        data = response.json()
        return data["data"][0]["url"]
    except requests.exceptions.RequestException as e:
        return None

@app.route('/', methods=['GET'])
def health_check():
    return jsonify({"message": "API is Working Properly and ready to test on Postman"}), 200

# Run the Flask app
if __name__ == '__main__':
    # Use 0.0.0.0 for all network interfaces and specify a port (default is 5000)
    app.run(host='0.0.0.0', port=5000, debug=True)
