const sendgrid = require('@sendgrid/mail');
const axios = require('axios');
require('dotenv').config();

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

function sendTestEmail() {
    const msg = {
      to: 'andrewstepanov@icloud.com', // Адрес получателя
      from: 'lessons@progkids.com', // Адрес отправителя, на котором зарегистрирован SendGrid
      subject: 'Test Email',
      text: 'This is a test email from SendGrid',
      html: '<p>This is a test email from SendGrid</p>',
    };
    
    sendgrid.send(msg)
      .then(() => {
        console.log('Test email sent');
      })
      .catch((error) => {
        console.error('Error sending test email:', error);
      });
  }
async function addContactToList(email, firstName, lastName) {
    const url = `https://api.sendgrid.com/v3/marketing/contacts`;
  
    const data = {
      contacts: [
        {
          email: email,
          first_name: firstName,
          last_name: lastName,
        },
      ],
    };
  
    const headers = {
      Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
      'Content-Type': 'application/json',
    };
  
    try {
      const response = await axios.put(url, data, { headers: headers });
      console.log('Contact added:', email);
    } catch (error) {
      console.error('Error adding contact:', error.message);
    }
  }
  
  module.exports = {
    sendTestEmail,
    addContactToList,
  };

