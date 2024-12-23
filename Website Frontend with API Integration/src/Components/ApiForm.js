import React, { useState } from 'react';
import axios from 'axios';
import './ApiForm.css';
import EmailList from './EmailList';

const ApiForm = () => {
  const [inputData, setInputData] = useState({
    account_name: '',
    industry: '',
    pain_points: '',
    campaign_objective: '',
    number_of_emails: 0,
    language: '',
    contacts: [{ job_title: '', name: '', email: '' }],
  });
  const [emails, setEmails] = useState([]);
  const [downloadLink, setDownloadLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState({});

  // Validation function
  const validateForm = () => {
    let isValid = true;
    const errors = {};

    // Account Name Validation
    if (!inputData.account_name.trim()) {
      isValid = false;
      errors.account_name = 'Account Name is required.';
    } else if (!/^[a-zA-Z\s]+$/.test(inputData.account_name)) {
      isValid = false;
      errors.account_name = 'Account Name must only contain letters and spaces.';
    }

    // Industry Validation
    if (!inputData.industry.trim()) {
      isValid = false;
      errors.industry = 'Industry is required.';
    } else if (!/^[a-zA-Z\s]+$/.test(inputData.industry)) {
      isValid = false;
      errors.industry = 'Industry must only contain letters and spaces.';
    }

    // Pain Points Validation (Comma-separated and word limit of 20)
    if (!inputData.pain_points.trim()) {
      isValid = false;
      errors.pain_points = 'Pain Points are required.';
    } else {
      const painPoints = inputData.pain_points.split(',');
      painPoints.forEach((point, index) => {
        const trimmedPoint = point.trim();
        if (!/^[A-Z][a-zA-Z\s]+$/.test(trimmedPoint)) {
          isValid = false;
          errors.pain_points = `Pain Point ${index + 1} must start with a capital letter, contain only words.`;
        }
      });
      if (painPoints.length > 20) {
        isValid = false;
        errors.pain_points = 'Pain Points should not exceed 20 words.';
      }
    }

    // Campaign Objective Validation (Comma-separated and word limit of 20)
    if (!inputData.campaign_objective.trim()) {
      isValid = false;
      errors.campaign_objective = 'Campaign Objective is required.';
    } else {
      const objectives = inputData.campaign_objective.split(',');
      objectives.forEach((objective, index) => {
        const trimmedObjective = objective.trim();
        if (!/^[A-Z][a-zA-Z0-9\s,.!?]+$/.test(trimmedObjective)) {
          isValid = false;
          errors.campaign_objective = `Objective ${index + 1} must start with a capital letter and be a valid sentence.`;
        }
      });
      if (objectives.length > 20) {
        isValid = false;
        errors.campaign_objective = 'Campaign Objectives should not exceed 20 words.';
      }
    }

    // Number of Emails Validation (Max 3)
    if (!inputData.number_of_emails || inputData.number_of_emails <= 0 || inputData.number_of_emails > 3) {
      isValid = false;
      errors.number_of_emails = 'Number of Emails must be between 1 and 3. Due to token limitations, the number of emails is restricted to 3 only.';
    }

    // Language Validation
    if (!inputData.language.trim()) {
      isValid = false;
      errors.language = 'Language is required.';
    }

    // Contacts Validation
    inputData.contacts.forEach((contact, index) => {
      // Job Title Validation
      if (!contact.job_title.trim()) {
        isValid = false;
        errors[`job_title_${index}`] = `Job Title for contact is required.`;
      } else if (!/^[a-zA-Z\s]+$/.test(contact.job_title)) {
        isValid = false;
        errors[`job_title_${index}`] = `Job Title for contact must only contain letters and spaces.`;
      }

      // Name Validation
      if (!contact.name.trim()) {
        isValid = false;
        errors[`name_${index}`] = `Name for contact is required.`;
      } else if (!/^[a-zA-Z\s]+$/.test(contact.name)) {
        isValid = false;
        errors[`name_${index}`] = `Name for contact must only contain letters and spaces.`;
      }

      // Email Validation
      if (!contact.email.trim()) {
        isValid = false;
        errors[`email_${index}`] = `Email for contact ${index + 1} is required.`;
      } else if (
        !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(contact.email)
      ) {
        isValid = false;
        errors[`email_${index}`] = `Email for contact ${index + 1} must be a valid email address.`;
      }
    });

    setFormErrors(errors);
    return isValid;
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputData({ ...inputData, [name]: value });
  };

  const handleContactChange = (index, e) => {
    const contacts = [...inputData.contacts];
    contacts[index][e.target.name] = e.target.value;
    setInputData({ ...inputData, contacts });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Run form validation
    if (!validateForm()) {
      return; // Don't proceed if validation fails
    }

    setLoading(true);
    setError('');
    setDownloadLink('');

    try {
      const response = await axios.post(
        'https://onlinesales-api-maildriftcampaign.onrender.com/generate-emails',
        inputData
      );
      setEmails(response.data.emails);
      setDownloadLink(response.data.download_link);
    } catch (err) {
      setError('An error occurred while submitting the form.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Header Section */}
      <header className="header-section">
        <h5>Welcome to Personalized Email Campaign Generator !!!</h5>
      </header>

      {/* Main Container */}
      <div className="api-form-container">
        <form onSubmit={handleSubmit}>
          <h1>Email Generator</h1>
          
          {/* Form fields */}
          <div className="form-group">
            <label>Account Name</label>
            <input
              type="text"
              name="account_name"
              value={inputData.account_name}
              onChange={handleChange}
              required
            />
            {formErrors.account_name && <p className="error">{formErrors.account_name}</p>}
          </div>

          <div className="form-group">
            <label>Industry</label>
            <input
              type="text"
              name="industry"
              value={inputData.industry}
              onChange={handleChange}
              required
            />
            {formErrors.industry && <p className="error">{formErrors.industry}</p>}
          </div>

          <div className="form-group">
            <label>Pain Points</label>
            <input
              type="text"
              name="pain_points"
              value={inputData.pain_points}
              onChange={handleChange}
              required
            />
            {formErrors.pain_points && <p className="error">{formErrors.pain_points}</p>}
          </div>

          <div className="form-group">
            <label>Campaign Objective</label>
            <textarea
              name="campaign_objective"
              value={inputData.campaign_objective}
              onChange={handleChange}
              required
            />
            {formErrors.campaign_objective && <p className="error">{formErrors.campaign_objective}</p>}
          </div>

          <div className="form-group">
            <label>Number of Emails</label>
            <input
              type="number"
              name="number_of_emails"
              value={inputData.number_of_emails}
              onChange={handleChange}
              required
            />
            {formErrors.number_of_emails && <p className="error">{formErrors.number_of_emails}</p>}
          </div>

          <div className="form-group">
            <label>Language</label>
            <select
              name="language"
              value={inputData.language}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Select a Language
              </option>
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              <option value="German">German</option>
              <option value="Chinese">Chinese</option>
              <option value="Japanese">Japanese</option>
              <option value="Hindi">Hindi</option>
              <option value="Marathi">Marathi</option>
              <option value="Arabic">Arabic</option>
            </select>
            {formErrors.language && <p className="error">{formErrors.language}</p>}
          </div>

          {inputData.contacts.map((contact, index) => (
            <div key={index} className="contact-group">
              <div className="form-group">
  <label>Job Title</label>
  <input
    type="text"
    name="job_title"
    value={contact.job_title}
    onChange={(e) => handleContactChange(index, e)}
    required
  />
  {formErrors[`job_title_${index}`] && (
    <p className="error">{formErrors[`job_title_${index}`]}</p>
  )}
</div>

<div className="form-group">
  <label>Name</label>
  <input
    type="text"
    name="name"
    value={contact.name}
    onChange={(e) => handleContactChange(index, e)}
    required
  />
  {formErrors[`name_${index}`] && (
    <p className="error">{formErrors[`name_${index}`]}</p>
  )}
</div>


              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={contact.email}
                  onChange={(e) => handleContactChange(index, e)}
                  required
                />
                {formErrors[`contact_${index}_email`] && (
                  <p className="error">{formErrors[`contact_${index}_email`]}</p>
                )}
              </div>
            </div>
          ))}

          <div>
            <button type="submit" className="submit-btn">
              {loading ? '✨ Wait, the magic is happening! ✨' : 'Submit'}
            </button>
            {loading && <p className="loading-msg">🌟 Your personalized email campaign is being generated... 🌟</p>}
          </div>

          {error && <p className="error">{error}</p>}
        </form>

        {/* Display emails and download link below the form */}
        {emails.length > 0 && <EmailList emails={emails} downloadLink={downloadLink} />}
      </div>
    </>
  );
};

export default ApiForm;
