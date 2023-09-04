import bcrypt from 'bcrypt';
const salt = bcrypt.genSaltSync(Number(process.env.SALTROUNDS));
const hashPassword = (password) => {
  const hash = bcrypt.hashSync(password, salt);
  return hash;
};
export default hashPassword;
