const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { generateUniqueOrderId } = require("./utils");

const logDir = path.join(__dirname, 'logs', 'test');
const logPath = path.join(logDir, 'admitad.csv');

if (!fs.existsSync(logDir)) 
  fs.mkdirSync(logDir, { recursive: true });

if (!fs.existsSync(logPath))
  fs.writeFileSync(logPath, 'timestamp,admitad_uid,order_id,email\n');

async function sendAdmitadPostback({ admitad_uid, email }) {
  try {
    if (!admitad_uid) {
      console.log("No admitad_uid");
      return;
    }

    const order_id = generateUniqueOrderId();

    const queryParams = new URLSearchParams({
      campaign_code: "3239143672",
      postback: "1",
      postback_key:
        process.env.ADMITAD_POSTBACK_KEY,
      action_code: "1",
      uid: admitad_uid,
      order_id,
      tariff_code: "1",
      payment_type: "sale"
    });

    const response = await axios.get(
      `https://ad.admitad.com/r?${queryParams.toString()}`
    );

    try {
      const timestamp = new Date().toISOString();
      const csvLine = `${timestamp},${admitad_uid},${order_id},${email}\n`;
      fs.appendFileSync(logPath, csvLine);
    } catch (err) {
      console.error("Ошибка при сохранении лога Admitad:", err);
    }

    return response.data;
  } catch (error) {
    console.error("Ошибка при отправке postback в Admitad:", error.message);
  }
}

module.exports = {
  sendAdmitadPostback
};
