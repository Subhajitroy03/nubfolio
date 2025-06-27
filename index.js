require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const app = express();
const cors = require("cors");
app.use(cors());
const PORT = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Serve static files (HTML, CSS, JS)
app.use(express.static("public")); // if your HTML is in /public folder
// POST route to send email
app.post("/send", async (req, res) => {
  console.log("Form received:", req.body); 
  const { name, email, subject, message } = req.body;
  // Setup transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.PASSWORD, // Use Gmail App Password
    },
});

  try {
    const mailOptions = {
      from: email,
      to: process.env.EMAIL_ADDRESS,
      subject: `Contact Form: ${subject}`,
      text: `From: ${name} <${email}>\n\n${message}`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    res.status(200).send("Message sent successfully.");
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("Error sending email.");
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
