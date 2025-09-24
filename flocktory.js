const axios = require('axios');
const cron = require('node-cron');

const FLOCKTORY_API_URL =
  'https://client.flocktory.com/v2/exchange/phone-leads';

const transformData = (lead) => ({
  title: 'Flocktory',
  name: lead.name,
  email: lead.email === 'xname@flocktory.com' ? undefined : lead.email,
  phone: lead.phone,
  roistat_visit: `flocktory_${lead.campaign_id}`,
  fields: {
    created_at: lead.created_at
  }
});

const loadLeads = async (site_id) => {
  const now = Math.floor(new Date().getTime() / 1000);
  const { data } = await axios.get(FLOCKTORY_API_URL, {
    params: {
      token: process.env.FLOCKTORY_API_TOKEN,
      site_id,
      page: 1,
      per_page: 100,
      from: now - 60,
      to: now,
      add_fields: 'campaign_id'
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
    const [leads, leadsKz] = await Promise.all([
      loadLeads(5443),
      loadLeads(6667)
    ]);

    console.log('Loaded', leads.length, 'flocktory leads');
    console.log('Loaded', leadsKz.length, 'flocktory kz leads');

    leads.forEach(sendLead);
    leadsKz.forEach(sendLead);
  });
};

module.exports = { scheduleFlocktory };
