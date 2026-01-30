import database from "infra/database.js";
import { ValidationError, NotFoundError } from "infra/errors.js";

async function findOneByUsername(username) {
  const userFound = await runSelectQuery(username);
  return userFound;

  async function runSelectQuery(username) {
    // Why we don't have a LIMIT 1 in this query? https://gist.github.com/guslwl/f80e3a5c03c1b14c1422cf559e7fd4b0
    const results = await database.query({
      text: `
      SELECT
        *
      FROM
        users
      WHERE
        LOWER(username) = LOWER($1)
    ;`,
      values: [username],
    });

    if (results.rowCount === 0) {
      throw new NotFoundError({
        message: "The username was not found",
        action: "Check the username and try again",
      });
    }
    return results.rows[0];
  }
}

async function create(userInputValues) {
  await validateUniqueEmail(userInputValues.email);
  await validateUniqueUsername(userInputValues.username);

  const newUser = await runInsertQuery(userInputValues);
  return newUser;

  async function validateUniqueUsername(username) {
    const results = await database.query({
      text: `
      SELECT
        username
      FROM
        users
      WHERE
        LOWER(username) = LOWER($1)
    ;`,
      values: [username],
    });

    if (results.rowCount > 0) {
      throw new ValidationError({
        message: "The username provided is already in use",
        action: "Use another username",
      });
    }
  }

  async function validateUniqueEmail(email) {
    const results = await database.query({
      text: `
      SELECT
        email
      FROM
        users
      WHERE
        LOWER(email) = LOWER($1)
    ;`,
      values: [email],
    });

    if (results.rowCount > 0) {
      throw new ValidationError({
        message: "The email provided is already in use",
        action: "Use another email",
      });
    }
  }

  async function runInsertQuery(userInputValues) {
    const newUser = await database.query({
      text: `
    INSERT INTO
      users (username, email, password)
    VALUES
      ($1, $2, $3)
    RETURNING
      *
    ;`,
      values: [
        userInputValues.username,
        userInputValues.email,
        userInputValues.password,
      ],
    });

    return newUser.rows[0];
  }
}

const user = { create, findOneByUsername };

export default user;
