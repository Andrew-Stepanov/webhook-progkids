const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { generateUniqueOrderId } = require('./utils');

const logDir = path.join(__dirname, 'logs', 'test');
const logPath = path.join(logDir, 'salid.csv');

if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

if (!fs.existsSync(logPath))
  fs.writeFileSync(
    logPath,
    'timestamp,utm_medium,utm_campaign,utm_term,id_polzovatelya,order_id,email\n'
  );

async function sendSalidPostback({
  utm_medium,
  utm_campaign,
  utm_term,
  id_polzovatelya,
  email,
  goal
}) {
  try {
    if (!utm_term) {
      console.log('No utm_term for salid');
      return;
    }

    const order_id = generateUniqueOrderId();

    const queryParams = new URLSearchParams({
      offer: utm_medium,
      webmaster: utm_campaign,
      clickid: utm_term,
      id_polzovatelya,
      klient: 'Progkids',
      cel: goal || 'registration'
    });

    const response = await axios.get(
      `https://salid.org/postback/ads.php?${queryParams.toString()}`
    );

    try {
      const timestamp = new Date().toISOString();
      const csvLine = `${timestamp},${utm_medium},${utm_campaign},${utm_term},${id_polzovatelya},${order_id},${email}\n`;
      fs.appendFileSync(logPath, csvLine);
    } catch (err) {
      console.error('Ошибка при сохранении лога Salid:', err);
    }

    return response.data;
  } catch (error) {
    console.error('Ошибка при отправке postback в Salid:', error.message);
  }
}

module.exports = {
  sendSalidPostback
};
