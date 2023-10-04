const sendgrid = require('@sendgrid/mail');
const axios = require('axios');
require('dotenv').config();

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

function sendTestEmail() {
    const msg = {
      to: 'andrewstepanov@icloud.com', // Адрес получателя
      from: 'lessons@progkids.com', // Адрес отправителя, на котором зарегистрирован SendGrid
      subject: 'Webhook service',
      text: 'Server is online',
      html: '<p>Server is online</p>',
    };
    
    sendgrid.send(msg)
      .then(() => {
        console.log('Test email sent');
      })
      .catch((error) => {
        console.error('Error sending test email:', error);
      });
  }

async function getContactByEmail(email) {
  const url = `https://api.sendgrid.com/v3/marketing/contacts/search`;
  const data = {
      query: `email = '${email}'`
  };
  const headers = {
      Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
      'Content-Type': 'application/json',
  };
  
  try {
      const response = await axios.post(url, data, { headers: headers });
      return response.data.result[0];  // предполагается, что email уникален
  } catch (error) {
      console.error('Error fetching contact:', error.message);
      throw error;
  }
}

async function addContactToList(email, firstName = null, lastName = null, listId = null, trialScheduled = null, trialCompleted = null, paid) {
    const url = `https://api.sendgrid.com/v3/marketing/contacts`;
    const currentContact = await getContactByEmail(email);

    const e6_N = currentContact && currentContact.custom_fields.trialScheduled === 1 ? 1 : Number(trialScheduled);
    const e7_N = currentContact && currentContact.custom_fields.trialCompleted === 1 ? 1 : Number(trialCompleted);
    const e10_N = currentContact && currentContact.custom_fields.paid === 1 ? 1 : Number(paid) || 0;
  
    const data = {
      contacts: [
        {
          email: email,
          first_name: firstName,
          last_name: lastName,
          custom_fields: {
              e6_N: e6_N,
              e7_N: e7_N,
              e10_N: e10_N,
          }
        },
      ],
      list_ids: listId ? [listId] : [],
    };
  
    const headers = {
      Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
      'Content-Type': 'application/json',
    };
  
    try {
      const response = await axios.put(url, data, { headers: headers });
      console.log('Contact added:', email);
    } catch (error) {
      console.error('Error adding contact:', error.response ? error.response.data : error.message);
      throw error;
    }
    
  }
  
  module.exports = {
    sendTestEmail,
    addContactToList,
  };

