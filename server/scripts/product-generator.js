"use strict";
require("dotenv").config();

const KnexDriver = require("../driver/KnexDriver");
const { faker } = require("@faker-js/faker");
const Tables = require("../driver/Table");
const { v4: uuid } = require("uuid");
const chalk = require("chalk");

/**
 * Startup
 */
(async () => {
  console.log(`Generating a thousand products`);
  for (let i = 0; i < 1000; i++) {
    const generatedProduct = {
      Id: uuid(),
      Name: faker.commerce.productName(),
      Price: faker.commerce.price(),
      Description: faker.commerce.productDescription(),
      CreatedAt: faker.date.past(2).getTime(),
      Condition: ["New 99%", "97%", "95%", "New"][
        Math.floor(Math.random() * 4)
      ],
    };

    // eslint-disable-next-line
    await KnexDriver(Tables.Products).insert(generatedProduct);
    console.log(generatedProduct);
  }
})()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error(chalk.red(err.stack));
    process.exit(1);
  });
