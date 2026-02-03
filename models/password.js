import bcryptjs from "bcryptjs";
import { ValidationError } from "infra/errors.js";

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

  if (!pepper) {
    throw new Error(
      "'PASSWORD_PEPPER' is not defined in environment variables",
    );
  }

  if (typeof inputPassword != "string" || inputPassword.trim().length == 0) {
    throw new ValidationError({
      message: `The provided password is invalid (${typeof inputPassword})`,
      action: "Provide a new password",
    });
  }
  return inputPassword + pepper;
}

const password = {
  hash,
  compare,
};
export default password;
