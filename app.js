const express = require("express");
const axios = require("axios");
const sendgrid = require("./sendgrid");
const typeform = require("./typeform");
require("dotenv").config();

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Замените этими значениями настройки своего webhook-получателя
const webhookReceiverUrl = process.env.WEBHOOK_RECEIVER_URL;

function transformData(data) {
  const transformedData = {
    title: "Webflow", // Замените на нужное значение или сформируйте из входящих данных
    name: data.data.name,
    email: data.data.email,
    phone: data.data.phone_full || data.data.phone,
    comment: data.data.page_url, // Замените на нужное значение или сформируйте из входящих данных
    roistat_visit: data.data.roistat_visit,
    fields: {
      site: data.site, // Замените на нужное значение или сформируйте из входящих данных
      ip: data.data.user_ip,
      country: data.data.user_country,
      phone: data.data.phone, 
    },
  };

  return transformedData;
}

const excludedFormName = ["doNotSendForm", "doNotSendForm-1"];

app.post("/webhook", async (req, res) => {
  const receivedData = req.body;
  console.log("Received webhook data:", receivedData);

  // Если ID формы находится в списке исключений, пропустите обработку
  if (excludedFormName.includes(receivedData.name)) {
    console.log("Skipping processing for form ID:", receivedData.formId);
    res.sendStatus(200);
    return;
  }
  // Если имя формы 'subscribe', добавьте почту в SendGrid
  if (receivedData.name === "subscribe") {
    const email = receivedData.data.email;
    try {
      // Замените 'your_list_id' на нужный ID вашего списка в SendGrid
      await sendgrid.addContactToList(
        email,
        null,
        null,
        "f6ea749f-36c4-42e9-a2fb-1fde740cd3df"
      );
      console.log("Email added to SendGrid:", email);
      return;
    } catch (error) {
      console.error("Error adding email to SendGrid:", error.message);
      res.sendStatus(500);
      return;
    }
  }

  // Ваша текущая логика обработки вебхуков продолжает выполняться здесь

  const transformedData = transformData(receivedData);

  try {
    const response = await axios.post(webhookReceiverUrl, transformedData);
    console.log("Webhook sent:", transformedData);
    res.sendStatus(200);
  } catch (error) {
    console.error("Error sending webhook:", error.message);
    res.sendStatus(500);
  }
});

// Добавьте новый маршрут для добавления контакта в SendGrid
app.post("/sendgrid-add", async (req, res) => {
  const receivedData = req.body;
  console.log("Received webhook data:", receivedData);

  // Извлеките нужные данные из вебхука
  const email = receivedData.email;
  const firstName = receivedData.name;
  const lastName = "";
  const listId = receivedData.listId;
  const trialScheduled = receivedData.trialScheduled;
  const trialCompleted = receivedData.trialCompleted;
  const paid = receivedData.paid || "0";

  if (!email) {
    res.status(400).send({ error: "Email are required" });
    return;
  }

  try {
    // Добавьте контакт в глобальный список контактов
    await sendgrid.addContactToList(
      email,
      firstName,
      lastName,
      listId,
      trialScheduled,
      trialCompleted,
      paid
    );
    res.status(200).send({ message: "Contact added successfully" });
  } catch (error) {
    console.error("Error adding contact:", error.message);
    res.status(500).send({ error: "Error adding contact" });
  }
});

app.post("/typeform-webhook", async (req, res) => {
  const receivedData = req.body;
  console.log("Received Typeform webhook data:", receivedData);

  const extractedData = typeform.extractTypeFormData(receivedData);
  await typeform.addToWebflowCMS(extractedData);

  res.sendStatus(200);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Webhook server listening on port ${port}`);
  //  sendgrid.sendTestEmail();
});
