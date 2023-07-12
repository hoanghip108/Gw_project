class BaseOptions {
  constructor(to, subject) {
    this.from = process.env.MAIL;
    this.to = to;
    this.subject = subject;
  }
}

class verrifyEmailOption extends BaseOptions {
  constructor(to, subject, link) {
    super(to, subject);
    this.html = link;
  }
}
class resetPasswordOption extends BaseOptions {
  constructor(to, subject, message) {
    super(to, subject);
    this.text = message;
  }
}
export { verrifyEmailOption, resetPasswordOption };
