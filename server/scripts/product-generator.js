"use strict";
require("dotenv").config();

const KnexDriver = require("../driver/KnexDriver");
const { faker } = require("@faker-js/faker");
const Tables = require("../driver/Table");
const { v4: uuid } = require("uuid");
const chalk = require("chalk");

const flip = () => {
  return Math.random() <= 0.1;
};
/**
 * Startup
 */
(async () => {
  console.log(`Generating a thousand products`);
  const salesIds = [];
  // Generate the product
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

    // Flip coin for sales or not?
    if (flip()) {
      salesIds.push({ Id: generatedProduct.Id, Price: generatedProduct.Price });
    }

    // eslint-disable-next-line
    await KnexDriver(Tables.Products).insert(generatedProduct);
    console.log(generatedProduct);
  }

  // Generating some sales
  console.log(`Generating sales for a set of product`);

  for (let i = 0; i < salesIds.length; i++) {
    const currentItem = salesIds[i];
    // From 20% to 60%
    const saleRatio = Math.abs(Math.random() * (0.2 - 0.6) + 0.2);
    // Multiply ratio with sale price
    const salePrice = currentItem.Price * saleRatio;

    console.log(`Set sale for the product ${currentItem.Id}`);
    const items = { ProductId: currentItem.Id, SalePrice: salePrice };
    // eslint-disable-next-line
    await KnexDriver(Tables.SaleProducts).insert(items);
    console.log(items);
  }
})()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error(chalk.red(err.stack));
    process.exit(1);
  });
