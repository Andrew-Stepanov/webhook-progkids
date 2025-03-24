const axios = require("axios");

async function sendAdmitadPostback({ admitad_uid, order_id }) {
  try {
    if (!admitad_uid) {
      console.log("No admitad_uid");
      return;
    }

    const queryParams = new URLSearchParams({
      campaign_code: "3239143672",
      postback: "1",
      postback_key:
        process.env.ADMITAD_POSTBACK_KEY,
      action_code: "1",
      uid: admitad_uid,
      order_id: order_id || "",
      tariff_code: "1",
      payment_type: "sale"
    });

    const response = await axios.get(
      `https://ad.admitad.com/r?${queryParams.toString()}`
    );

    return response.data;
  } catch (error) {
    console.error("Ошибка при отправке postback в Admitad:", error.message);
  }
}

module.exports = {
  sendAdmitadPostback
};
