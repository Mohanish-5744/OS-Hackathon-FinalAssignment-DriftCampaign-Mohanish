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
          </div>
          <div className="form-group">
            <label>Campaign Objective</label>
            <textarea
              name="campaign_objective"
              value={inputData.campaign_objective}
              onChange={handleChange}
              required
            />
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
          </div>
          <div className="form-group">
            <label>Language</label>
            <input
              type="text"
              name="language"
              value={inputData.language}
              onChange={handleChange}
              required
            />
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
              </div>
            </div>
          ))}
          <div>
            <button type="submit" className="submit-btn">
              {loading ? 'Wait! Your responses are being generated!!' : 'Submit'}
            </button>
            {loading && <p className="loading-msg">It may take a little while...</p>}
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
