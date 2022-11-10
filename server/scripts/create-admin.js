"use strict";
require("dotenv").config();

const readline = require("readline");
const KnexDriver = require("../driver/KnexDriver");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const bcryptjs = require("bcryptjs");
const Tables = require("../driver/Table");
const { v4: uuid } = require("uuid");
const chalk = require("chalk");
const validator = require("validator");

rl._writeToOutput = function _writeToOutput(stringToWrite) {
  if (rl.stdoutMuted) {
    rl.output.write(
      "\x1B[2K\x1B[200D" +
        rl.query +
        "[" +
        (rl.line.length % 2 == 1 ? "=-" : "-=") +
        "]",
    );
  } else {
    rl.output.write(stringToWrite);
  }
};

/**
 * Insert this account as an admin into database
 *
 * @param {*} account an account to insert into database
 */
async function createAdministratorUser(account) {
  try {
    const salt = bcryptjs.genSaltSync(
      Number.parseInt(process.env.BCRYPT_HASH_ROUNDS || 10),
    );
    account.password = bcryptjs.hashSync(account.password, salt);
    account.id = uuid();
    // Check if exists
    const persistUser = await KnexDriver.select("*")
      .from(Tables.Users)
      .where("Id", account.id)
      .orWhere("Email", account.email)
      .orWhere("Phone", account.phone)
      .first();

    if (persistUser) {
      throw new Error(
        "The current user was existed. Determine by Email or Phone or Id",
      );
    }

    // Insert into users table
    await KnexDriver.insert(account).into(Tables.Users);

    // Insert into user role table
    await KnexDriver.insert({
      UserId: account.id,
      Role: "admin",
    }).into(Tables.UserRoles);

    console.log(chalk.green(`Successfully create the admin user`));
  } catch (err) {
    throw err;
  }
}

(async () => {
  const account = {};
  rl.query = `Password: `;

  rl.question(`Email: `, (email) => {
    account.email = email;
    if (!validator.isEmail(account.email)) {
      throw new Error(
        `Invalid email format from account.email ${account.email}`,
      );
    }

    rl.stdoutMuted = true;
    rl.question(rl.query, (password) => {
      account.password = password;
      // console.log(account);

      rl.stdoutMuted = false;

      rl.question("First name: ", (firstName) => {
        account.firstName = firstName;
        rl.question("Last name: ", (lastName) => {
          account.lastName = lastName;
          rl.question("Phone: ", async (phone) => {
            account.phone = phone;
            if (!validator.isNumeric(account.phone)) {
              throw new Error(
                `Invalid phone format from account.phone ${account.phone}`,
              );
            }

            console.log({
              email: account.email,
              password: `*`.repeat(account.password.length),
              firstName: account.firstName,
              lastName: account.lastName,
              phone: account.phone,
            });

            await createAdministratorUser(account);

            process.exit(0);
          });
        });
      });
    });
  });
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
