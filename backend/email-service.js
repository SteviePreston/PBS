const sender = "prestigeboiler1234@gmail.com"
const APIkey = "insert_key"

const express = require('express');
const app = express.Router();
API_VERSION = "/v1";
API_PATH = API_VERSION + "/api";

app.post(API_PATH + '/send-email', (req, res) => {
  const { recipient, template, template_data } = req.body;
  sgMail.setApiKey(APIkey);
  const msg = {
    templateId: template,
    to: recipient,
    from: sender,
    dynamic_template_data: template_data,
  };
  sgMail.send(msg).then(() => {
    res.send('Email sent successfully');
  }).catch((error) => {
    console.error(error);
    res.status(500).send('Error sending email');
  });
});
app.post(API_PATH + '/schedule-email', (req, res) => {
    const { recipient, template, template_data, date } = req.body;
    sgMail.setApiKey(APIkey);
    const msg = {
      templateId: template,
      to: recipient,
      from: sender,
      send_at: date,
      dynamic_template_data: template_data,
    };
    sgMail.send(msg).then(() => {
      res.send('Email sent successfully');
    }).catch((error) => {
      console.error(error);
      res.status(500).send('Error sending email');
    });
  });
  

module.exports = app;
