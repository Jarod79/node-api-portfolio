const express = require('express');

const app = express();
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');

require('dotenv').config();

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const port = process.env.PORT || 8000;
app.use(express.json());

const corsOptions = {
  origin: ['http://localhost:3000', 'https://jarod79.github.io'],
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
