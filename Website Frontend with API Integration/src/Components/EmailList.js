import React from 'react';
import './EmailList.css';

const EmailList = ({ emails, downloadLink }) => {
  return (
    <div className="email-list-container">
      <h2>Generated Emails</h2>
      {emails.map((email, index) => (
        <div key={index} className="email-item">
          <h3>Subject: {email.subject}</h3>
          <div className="email-body">
            <p>Body: {email.body}</p>
          </div>
          {email.image_url && (
            <img src={email.image_url} alt="Email Visual" />
          )}
          <p>
            Call to Action: 
            <span className="call-to-action-btn">{email.call_to_action}</span>
          </p>
          <p>Optimal Send Time: {email.optimal_send_time}</p>

          {/* CSV Download Button */}
          {downloadLink && (
            <div className="download-btn-container">
              <a href={downloadLink} download>
                <button className="download-btn">Download CSV</button>
              </a>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default EmailList;
