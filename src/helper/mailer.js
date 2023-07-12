class mailOptions {
  constructor(toUser, link) {
    this.from = process.env.MAIL;
    this.to = toUser;
    this.subject = 'Account Verification Link';
    this.html =
      'Hello,<br> Please Click on the link to verify your email.<br><a href=' +
      link +
      '>Click here to verify</a>';
  }
}
export default mailOptions;
