import bcryptjs from "bcryptjs";

async function hash(password) {
  const rounds = process.env.NODE_ENV === "production" ? 14 : 1;

  return await bcryptjs.hash(getFullPassword(password), rounds);
}

async function compare(providedPassword, storedPassword) {
  return await bcryptjs.compare(
    getFullPassword(providedPassword),
    storedPassword,
  );
}

function getFullPassword(inputPassword) {
  const pepper = process.env.PASSWORD_PEPPER;
  return inputPassword + pepper;
}

const password = {
  hash,
  compare,
};
export default password;
