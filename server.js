require("dotenv").config();
const express = require("express");
const router = express.Router();
const validator = require("validator");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/", router);
app.listen(5000, () => console.log("Server Running"));

const contactEmail = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS,
  },
});

contactEmail.verify((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Ready to Send");
  }
});

router.post("/send", (req, res) => {
  console.log("Received request:", req.body);
  const name = req.body.name;
  const email = req.body.email;
  const message = req.body.message;

  if (name === "" || email === "" || message === "") {
    console.error("Error sending email: One or many fields may be empty");
    return res.json({ status: "ERROR One or many fields may be empty" });
  }

  const isValidEmail = validator.isEmail(email);

  if (!isValidEmail) {
    console.log("Error sending email: Email is invalid");
    return res.json({ status: "ERROR Email is invalid" });
  }

  const mail = {
    from: email,
    to: "shakhramgafurov@gmail.com",
    subject: `${name} Submitted Contact Form`,
    html: `<p>Name: ${name}</p>
           <p>Email: ${email}</p>
           <p>Message: ${message}</p>`,
  };

  contactEmail.sendMail(mail, (error) => {
    if (error) {
      console.error("Error sending email:", error);
      return res.json({ status: "ERROR Unable to send email : " + error });
    } else {
      console.log("Email sent successfully");
      return res.json({ status: "Message sent!" });
    }
  });
});
