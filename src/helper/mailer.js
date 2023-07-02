const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport('SMTP', {
  service: 'Gmail',
  auth: {
    user: 'hoanghip108@gmail.com',
    pass: 'asmqqfxnkzmztnao',
  },
});
const mailOptions = {
  from: process.env.MAIL,
  to: newUser.email,
  subject: 'Account Verification Link',
  html:
    'Hello,<br> Please Click on the link to verify your email.<br><a href=' +
    link +
    '>Click here to verify</a>',
};
export { transporter, mailOptions };
