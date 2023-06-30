const User = require("../database/models/user");
const nodemailer = require("nodemailer");
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
} = require("../helper/apiResponse");
const { sequelize } = require("../config/database");
const { Op } = require("sequelize");
import {
  FORM_CATEGORY,
  FORM_STATUS,
  USER_FORM_STATUS,
  FORM_MESSAGE,
  USER_STATUS,
} from "../data/constant";
import bcrypt from "bcrypt";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";
const login = async (payload) => {
  try {
    const user = await User.findOne({ where: { username: payload.username } });
    if (user) {
      if (bcrypt.compareSync(payload.password, user.password)) {
        const dataForAccessToken = {
          userId: user.id,
          username: user.username,
        };
        const token = jwt.sign(dataForAccessToken, process.env.JWT_SECRET, {
          expiresIn: process.env.TOKEN_EXPIRATION,
        });
        return { user, token };
      }
    }
    return null;
  } catch (err) {
    throw new Error(err);
  }
};
var newUserId;
const createUser = async (host, payload) => {
  let t;
  try {
    t = await sequelize.transaction();
    const salt = bcrypt.genSaltSync(Number(process.env.SALTROUNDS));
    const hash = bcrypt.hashSync(payload.password, salt);
    const [newUser, created] = await User.findOrCreate({
      where: { [Op.or]: [{ username: payload.username }, { email: payload.email }] },
      defaults: { ...payload, password: hash, createdBy: "A", isActive: false },
      transaction: t,
    });
    newUser.setDataValue("password", undefined);
    await t.commit();
    if (created) {
      var transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: process.env.MAIL,
          pass: process.env.MAIL_PASSWORD,
        },
      });
      var mailOptions, link;
      newUserId = newUser.id;
      link = "http://" + host + "/api/users/auth/register/verify/" + newUser.id;
      mailOptions = {
        from: "hoanghip108@gmail.com",
        to: newUser.email,
        subject: "Account Verification Link",
        html:
          "Hello,<br> Please Click on the link to verify your email.<br><a href=" +
          link +
          ">Click here to verify</a>",
      };
      transporter.sendMail(mailOptions, function (err) {
        if (err) {
          return res.status(500).send({
            msg: "Technical Issue!, Please click on resend for verify your Email.",
          });
        }
        return res
          .status(200)
          .send(
            "A verification email has been sent to " +
              newUser.email +
              ". It will be expire after one day. If you not get verification Email click on resend token."
          );
      });
      return newUser;
    }
    return null;
  } catch (err) {
    console.log(err);
    transaction.rollback();
    next(err);
  }
};
const verifyUser = async (id) => {
  console.log("id value: " + id);
  const user = await User.findOne({ where: { id: id } });
  if (user) {
    user.isActive = true;
    await user.save();
    return user;
  } else {
    return null;
  }
};
export { createUser, login, verifyUser };
