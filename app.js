const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

// Замените этими значениями настройки своего webhook-получателя
// const webhookReceiverUrl = process.env.WEBHOOK_RECEIVER_URL;
const webhookReceiverUrl = 'https://cloud.roistat.com/integration/webhook?key=eb40c961ee2b6f9af08f935b26d9607a';

function transformData(data) {
    const transformedData = {
      title: 'Webflow', // Замените на нужное значение или сформируйте из входящих данных
      name: data.data.name,
      email: data.data.email,
      phone: data.data.phone,
      comment: 'Комментарий проксилида', // Замените на нужное значение или сформируйте из входящих данных
      roistat_visit: data.data.roistat_visit,
      fields: {
        site: data.site, // Замените на нужное значение или сформируйте из входящих данных
        source: '', // Замените на нужное значение или сформируйте из входящих данных
      },
    };
  
    return transformedData;
  }  

app.post('/webhook', async (req, res) => {
  const receivedData = req.body;
  console.log('Received webhook data:', receivedData);

  const transformedData = transformData(receivedData);

  try {
    const response = await axios.post(webhookReceiverUrl, transformedData);
    console.log('Webhook sent:', transformedData);
    res.sendStatus(200);
  } catch (error) {
    console.error('Error sending webhook:', error.message);
    res.sendStatus(500);
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Webhook server listening on port ${port}`);
});