
const nodemailer = require("nodemailer");

require("dotenv").config();

module.exports.sendMail = async (email, subject, message) => {
  try {
    const transport = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
      secure : false
    });
    const sendmail =  await transport.sendMail({
        from : `${process.env.MAIL_USER}`,
        to : `${email}`,
        subject : `${subject}`,
        text : `${message}`
        })
        return sendmail
  } catch (error) {
    console.log(error.message);
    return error.message
  }
};
