"use strict";
require("dotenv").config();
const KnexDriver = require("../driver/KnexDriver");
const Tables = require("../driver/Table");
const { v4: uuid } = require("uuid");
const { faker } = require("@faker-js/faker");
const bcryptjs = require("bcryptjs");
const chalk = require("chalk");

(async () => {
  // Generating owner
  const salt = bcryptjs.genSaltSync(
    Number.parseInt(process.env.BCRYPT_HASH_ROUNDS),
  );
  // console.log(process.env.BCRYPT_HASH_ROUNDS);
  for (let i = 0; i < 100; i++) {
    const user = {
      Id: uuid(),
      FirstName: faker.name.fullName(),
      LastName: faker.name.lastName(),
      Email: faker.internet.email(),
      Phone: faker.phone.number("0#########"),
      Password: bcryptjs.hashSync(faker.internet.password(12), salt),
    };
    console.log(user);
    // eslint-disable-next-line
    await KnexDriver(Tables.Users).insert(user);
  }
})().then(() => {
  console.log(chalk.green(`Completed generate 100 users.`));
  process.exit(0);
});
