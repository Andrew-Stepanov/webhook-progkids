const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { generateUniqueOrderId, findRowsByEmail } = require("./utils");

const logDir = path.join(__dirname, 'logs');
const logPath = path.join(logDir, 'admitad.csv');

if (!fs.existsSync(logDir)) 
  fs.mkdirSync(logDir, { recursive: true });

if (!fs.existsSync(logPath))
  fs.writeFileSync(logPath, 'timestamp,admitad_uid,order_id,email,goal\n');

const COMMON_QUERY_PARAMS = {
  campaign_code: "3239143672",
  postback: "1",
  postback_key:
    process.env.ADMITAD_POSTBACK_KEY,
    tariff_code: "1",
};

async function sendAdmitadInitialPostback({ admitad_uid, email }) {
  if (!admitad_uid) {
    console.log("No admitad_uid");
    return;
  }

  const timestamp = new Date().toISOString();
  const order_id = generateUniqueOrderId();

  const queryParams = new URLSearchParams({
    ...COMMON_QUERY_PARAMS,
    action_code: "3",
    uid: admitad_uid,
    order_id,
    payment_type: "lead"
  });

  try {
    const response = await axios.get(
      `https://ad.admitad.com/r?${queryParams.toString()}`
    );

    const csvLine = `${timestamp},${admitad_uid},${order_id},${email},init\n`;
    fs.appendFileSync(logPath, csvLine);
  } catch (err) {
    console.error("Ошибка при сохранении лога Admitad:", err);
  }
}

async function sendSellPostback({ admitad_uid, order_id, email, sum }) {
  const queryParams = new URLSearchParams({
    ...COMMON_QUERY_PARAMS,
    action_code: "4",
    uid: admitad_uid,
    order_id,
    payment_type: "sale",
    price: sum
  });

  try {
    const response = await axios.get(
      `https://ad.admitad.com/r?${queryParams.toString()}`
    );

    const timestamp = new Date().toISOString();
    const csvLine = `${timestamp},${admitad_uid},${order_id},${email},sale\n`;
    fs.appendFileSync(logPath, csvLine);

    return response.data;
  } catch (error) {
    console.error("Ошибка при отправке postback в Admitad:", error.message);
  }
}

async function sendAdmitadSellPostback(email, sum) {
  const rows = await findRowsByEmail(logPath, email);

  if (!rows.length) {
    console.log('Admitad sell postback: no row found for email:', email);
    return;
  }

  if (rows.find((row) => row.goal === 'sale')) {
    console.log('Admitad sell postback: sale already exists for email:', email);
    return;
  }

  return await sendSellPostback({
    ...rows[rows.length - 1],
    email,
    sum,
  });
}

module.exports = {
  sendAdmitadInitialPostback,
  sendAdmitadSellPostback
};
