const EMAIL_REGEX =
  /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
const PASSWORD_REGEX = /^[A-Za-z\d@$!%*#?&]{6,}$/;
const USERNAME_REGEX = /^(?=.{4,32}$)[a-zA-Z0-9._@]+$/;
const NAME_REGEX = new RegExp(
  /^[a-zA-Z0-9\ẮẰẲẴẶĂẤẦẨẪẬÂÁÀÃẢẠĐẾỀỂỄỆÊÉÈẺẼẸÍÌỈĨỊỐỒỔỖỘÔỚỜỞỠỢƠÓÒÕỎỌỨỪỬỮỰƯÚÙỦŨỤÝỲỶỸỴẮẰẲẴẶĂẤẦẨẪẬÂÁÀẢÃẠĐẾỀỂỄỆÊÉÈẺẼẸÍÌỈĨỊỐỒỔỖỘÔỚỜỞỠỢƠÓÒỎÕỌỨỪỬỮỰƯÚÙỦŨỤÝỲỶỸỴ\ ]+$/,
  "i"
);
const TIME_REGEX = new RegExp(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/);
const TIME_WITH_SECOND_REGEX = new RegExp(
  /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/
);
const PHONE_NUMBER_REGEX = /^[0-9\s- \+]{8,13}$/;

export {
  EMAIL_REGEX,
  PASSWORD_REGEX,
  USERNAME_REGEX,
  NAME_REGEX,
  TIME_REGEX,
  TIME_WITH_SECOND_REGEX,
  PHONE_NUMBER_REGEX,
};
