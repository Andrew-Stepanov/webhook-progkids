const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { generateUniqueOrderId, findRowsByEmail } = require('./utils');

const logDir = path.join(__dirname, 'logs', 'test');
const logPath = path.join(logDir, 'salid.csv');

if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

if (!fs.existsSync(logPath))
  fs.writeFileSync(
    logPath,
    'timestamp,utm_medium,utm_campaign,utm_term,order_id,email,sum,goal\n'
  );

async function sendSalidPostback({
  utm_medium,
  utm_campaign,
  utm_term,
  email,
  sum,
  goal
}) {
  if (!utm_term) {
    console.log('No utm_term for salid');
    return;
  }

  const order_id = generateUniqueOrderId();

  const queryParams = new URLSearchParams({
    offer: utm_medium,
    webmaster: utm_campaign,
    clickid: utm_term,
    id_polzovatelya: order_id,
    klient: 'Progkids',
    cel: goal
  });

  try {
    const response = await axios.get(
      `https://salid.org/postback/ads.php?${queryParams.toString()}`
    );

    try {
      const timestamp = new Date().toISOString();
      const csvLine = `${timestamp},${utm_medium},${utm_campaign},${utm_term},${order_id},${email},${sum},${goal}\n`;
      fs.appendFileSync(logPath, csvLine);
    } catch (err) {
      console.error('Ошибка при сохранении лога Salid:', err);
    }

    return response.data;
  } catch (error) {
    console.error('Ошибка при отправке postback в Salid:', error.message);
  }
}

async function sendSalidRegisterPostback(options) {
  return await sendSalidPostback({
    ...options,
    goal: 'registration'
  });
}

async function sendSalidOrderPostback(email) {
  const rows = await findRowsByEmail(logPath, email);

  if (!rows.length) {
    console.log('Salid: no row found for email:', email);
    return;
  }

  if (rows.find((row) => row.goal === 'sale' || row.goal === 'order')) {
    console.log('Salid: sale or order already exists for email:', email);
    return;
  }

  return await sendSalidPostback({
    ...rows[rows.length - 1],
    email,
    sum: 1,
    goal: 'order'
  });
}

async function sendSalidSellPostback(email, sum) {
  const rows = await findRowsByEmail(logPath, email);

  if (!rows.length) {
    console.log('Salid: no row found for email:', email);
    return;
  }

  if (rows.find((row) => row.goal === 'sale')) {
    console.log('Salid: sale already exists for email:', email);
    return;
  }

  return await sendSalidPostback({
    ...rows[rows.length - 1],
    email,
    sum,
    goal: 'sale'
  });
}

module.exports = {
  sendSalidRegisterPostback,
  sendSalidSellPostback,
  sendSalidOrderPostback
};
