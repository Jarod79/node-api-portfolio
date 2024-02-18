const express = require('express');

const app = express();
const nodemailer = require('nodemailer');
const cors = require('cors');

require('dotenv').config();

const port = process.env.PORT || 8000;
app.use(express.json());

const corsOptions = {
  origin: [process.env.URL_ORIGIN_AUTHORIZATION,process.env.URL_ORIGIN_AUTHORIZATION_VERCEL,process.env.URL_ORIGIN_AUTHORIZATION_GIT],
  credentials: true,
  optionSuccessStatus: 200,
  maxAge: 3600,
};

app.use(cors(corsOptions));

app.post('/mail/send', async (req, res) => {
  const { prenom, nom, mail, message } = req.body;
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });
 
  const mailOptions = {
    from: `${mail}`,
    to: process.env.EMAIL,
    subject: 'Message portfolio',
    text: `Nom: ${prenom} ${nom},
    Email: ${mail},
    Message: ${message}`,
  };
  await new Promise((resolve, reject) => {
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      reject(err)
    } else {
      console.log(`Email sent:  ${info.response}`);
      resolve(info)
    }
  });
  });
  res.status(200).send();
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;