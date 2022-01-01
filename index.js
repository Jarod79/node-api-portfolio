const express = require('express');

const app = express();
const nodemailer = require('nodemailer');
const cors = require('cors');
const { google } = require('googleapis');

const { OAuth2 } = google.auth;
require('dotenv').config();

const oauth2Client = new OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  'https://developers.google.com/oauthplayground'
);

oauth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});

const accessToken = oauth2Client.getAccessToken();

const port = process.env.PORT || 8000;
app.use(express.json());

const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://jarod79.github.io',
    'https://portfolio-eric-arrijuria.herokuapp.com',
  ],
  credentials: true,
  optionSuccessStatus: 200,
  maxAge: 3600,
};
app.use(cors(corsOptions));

app.post('/', (req, res) => {
  const { prenom, nom, mail, message } = req.body;
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.EMAIL,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
      accessToken,
    },
  });
  const mailOptions = {
    from: process.env.EMAIL,
    to: `${mail}`,
    subject: 'Message portfolio',
    text: `Nom: ${prenom} ${nom},
    Email: ${mail},
    Message: ${message}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log(`Email sent:  ${info.response}`);
    }
  });

  res.status(200).send();
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
