const bookingConfirmationTemplate = "d-3bfa744c86434182826cf9fd863bb390"
const newBookingInfoTemplate = "d-4c925f4a933244dfbcc04f44c5bd4825"
const appointmentReminderTemplate = "d-add98d1de317464197279369fc9c3216"
const accountRegistrationTemplate = "d-869c131e0be54097b6a39b3cc70da668"
const sender = "prestigeboiler1234@gmail.com"
const admin_email = sender
const APIkey = "insert_key"

const express = require('express');
const router = express.Router();

router.post('/send-email', (req, res) => {
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
router.post('/schedule-email', (req, res) => {
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
  

module.exports = router;
