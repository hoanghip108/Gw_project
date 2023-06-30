const nodemailer = require("nodemailer");
const smtpTransport = nodemailer.createTransport("SMTP", {
  service: "Gmail",
  auth: {
    user: "hoanghip108@gmail.com",
    pass: "asmqqfxnkzmztnao",
  },
});
export default smtpTransport;
