import {
  createUser,
  login,
  verifyUser,
  disableUser,
  resetPassword,
} from '../services/userServices';
import { UserSchema, Loginschema } from '../validators/userValidate';
const nodemailer = require('nodemailer');
const httpStatus = require('http-status');
const {
  Common,
  Success,
  CreatedSuccess,
  DeletedSuccess,
  BadRequest,
  Unauthorized,
  Forbidden,
  NotFound,
  Conflict,
  ValidateFailed,
  WrongUsernameOrpassWord,
} = require('../helper/apiResponse');
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.MAIL,
    pass: process.env.MAIL_PASSWORD,
  },
});
const createUserController = async (req, res, next) => {
  try {
    const { error, value } = UserSchema.validate(req.body);
    if (error) {
      return res.status(httpStatus.BAD_REQUEST).json(error.details[0].message);
    }
    const host = req.headers.host;
    const user = await createUser(host, value);
    if (!user) {
      return res.status(httpStatus.CONFLICT).json(new Conflict());
    }

    var mailOptions, link;
    link = 'http://' + host + '/api/users/auth/register/verify/' + user.id;
    mailOptions = {
      from: 'hoanghip108@gmail.com',
      to: user.email,
      subject: 'Account Verification Link',
      html:
        'Hello,<br> Please Click on the link to verify your email.<br><a href=' +
        link +
        '>Click here to verify</a>',
    };
    transporter.sendMail(mailOptions, function (err) {
      if (err) {
        return res.status(500).send({
          msg: 'Technical Issue!, Please click on resend for verify your Email.',
        });
      }
      return res
        .status(200)
        .send(
          'A verification email has been sent to ' +
            user.email +
            '. It will be expire after one day. If you not get verification Email click on resend token.',
        );
    });
    res.status(httpStatus.OK);
    res.json(new Success('Data updated successfully.', user));
  } catch (err) {
    next(err);
  }
};
const loginController = async (req, res, next) => {
  try {
    const { error, value } = Loginschema.validate(req.body);
    if (error) {
      return res.status(httpStatus.Unauthorized).json(error.details[0].message);
    }
    const token = await login(value);
    if (token == null) {
      return res.status(httpStatus.UNAUTHORIZED).json(new WrongUsernameOrpassWord());
    }
    return res.status(httpStatus.OK).json(new Success('', token));
  } catch (err) {
    next(err);
  }
};
const verifyUserController = async (req, res, next) => {
  try {
    const id = req.params.id;
    const verify = await verifyUser(id);
    if (verify) {
      return res.status(httpStatus.OK).json(new Success('your account has been verified'));
    }
    return res.status(httpStatus.BadRequest).json(new BadRequest('email is not verified'));
  } catch (err) {
    next(err);
  }
};
const disableUserController = async (req, res, next) => {
  try {
    const uId = req.params.id;
    console.log(uId);
    const user = await disableUser(uId);
    if (user) {
      return res.status(httpStatus.OK).json(new Success('Account has been disabled'));
    }
    return res.status(400).json(new BadRequest('Account not found'));
  } catch (err) {
    next(err);
  }
};
const resetPasswordController = async (req, res, next) => {
  try {
    const email = req.body.email;
    const username = req.body.username;
    const newPassword = await resetPassword(email, username);
    if (newPassword) {
      const mailOptions = {
        from: 'hoanghip108@gmail.com',
        to: email,
        subject: 'New Password Reset',
        text: newPassword,
      };
      transporter.sendMail(mailOptions, function (err) {
        return res.status(httpStatus.OK).json(new Success('Check Your email for new password'));
      });
    }
    return res.status(httpStatus.BAD_REQUEST).json(new BadRequest('Account not found'));
  } catch (err) {
    next(err);
  }
};
export {
  createUserController,
  loginController,
  verifyUserController,
  disableUserController,
  resetPasswordController,
};
