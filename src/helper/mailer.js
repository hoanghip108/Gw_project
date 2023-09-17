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
    this.html = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Confirmation</title>
        <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #333;
        }
        p {
            color: #666;
        }
        a {
            color: #007bff;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
        .footer {
            margin-top: 20px;
            text-align: center;
            color: #999;
        }
        .button {
          display: inline-block;
          padding: 10px 20px;
          background-color: #007bff;
          color: #fff;
          text-decoration: none;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s;
      }

      .button:hover {
          background-color: #0056b3;
      }
    </style>
    </head>
    <body>
    <div class="container">
    <h1>Welcome to Our Website!</h1>
    <p>Thank you for registering with us. To activate your account, please click the following button:</p>
    <a href="${link}" class="button">Verify</a>
    <p>If you did not request this registration, please ignore this email.</p>
</div>
<div class="footer">
    <p>Thank you,<br>Your Website Team</p>
</div>
    </body>
    </html>
    `;
  }
}
class resetPasswordOption extends BaseOptions {
  constructor(to, subject, message) {
    super(to, subject);
    this.text = message;
  }
}
export { verrifyEmailOption, resetPasswordOption };
