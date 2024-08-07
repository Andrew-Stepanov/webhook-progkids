const axios = require('axios');
const cron = require('node-cron');

const FLOCKTORY_API_URL =
  'https://client.flocktory.com/v2/exchange/phone-leads';

const transformData = (lead) => ({
  title: 'Flocktory',
  name: lead.name,
  email: lead.email,
  phone: lead.phone,
  roistat_visit: 'Flocktory',
  fields: {
    created_at: lead.created_at
  }
});

const loadLeads = async () => {
  const now = Math.floor(new Date().getTime() / 1000);
  const { data } = await axios.get(FLOCKTORY_API_URL, {
    params: {
      token: process.env.FLOCKTORY_API_TOKEN,
      site_id: 5443,
      page: 1,
      per_page: 100,
      from: now - 60,
      to: now
    }
  });

  return data.data;
};

const sendLead = (lead) => {
  console.log('Flocktory item', lead);
  axios.post(process.env.WEBHOOK_RECEIVER_URL, transformData(lead));
};

const scheduleFlocktory = () => {
  cron.schedule('* * * * *', async () => {
    const leads = await loadLeads();

    console.log('Loaded', leads.length, 'leads');
    leads.forEach(sendLead);
  });
};

module.exports = { scheduleFlocktory };
