"use strict";
require("dotenv").config();

const KnexDriver = require("../driver/KnexDriver");
const { faker } = require("@faker-js/faker");
const Tables = require("../driver/Table");
const { v4: uuid } = require("uuid");
const chalk = require("chalk");
const { Categories } = require("../driver/Table");
const slugify = require("slugify");

const flip = () => {
  return Math.random() <= 0.1;
};
/**
 * Generating  products
 */
(async () => {
  // Categories generate
  const categoriesListId = [];
  for (let i = 1; i <= 10; i++) {
    const productName = faker.commerce.product();
    const category = {
      Id: i,
      Name: productName,
      Slug: slugify(productName, { lower: true, trim: true }),
      Description: faker.commerce.productDescription(),
    };
    // eslint-disable-next-line
    const response = await KnexDriver(Categories).insert(category);
    // Insert categories
    categoriesListId.push(category.Id);

    console.log(category, response);
  }

  // KnexDriver(Tables.Categories).insert()

  // Get all users
  // eslint-disable-next-line
  const usersListId = (await KnexDriver(Tables.Users).select("Id")).map(
    (user) => user.Id,
  );

  const getRandomUserId = () => {
    return usersListId[Math.floor(Math.random() * usersListId.length)];
  };

  console.log(`Generating a thousand products`);
  const salesIds = [];
  // Generate the product
  for (let i = 0; i < 1000; i++) {
    const generatedProduct = {
      Id: uuid(),
      Name: faker.commerce.productName(),
      Price: faker.commerce.price(),
      Description: faker.lorem.paragraphs(
        Number.parseInt(faker.random.numeric(2)),
      ),
      CreatedAt: faker.date.past(2).getTime(),
      Condition: faker.helpers.arrayElement(["New 99%", "97%", "95%", "New"]),
    };

    // Decide whether to sale or not
    if (flip()) {
      salesIds.push({ Id: generatedProduct.Id, Price: generatedProduct.Price });
    }
    // eslint-disable-next-line
    await KnexDriver(Tables.Products).insert(generatedProduct);
    console.log(generatedProduct);

    // Add user which own this product
    const userProduct = {
      ProductId: generatedProduct.Id,
      UserId: getRandomUserId(),
    };
    // eslint-disable-next-line
    await KnexDriver(Tables.UserProducts).insert(userProduct);
    console.log(`${userProduct.ProductId} <=> ${userProduct.UserId}`);

    // Put category for this product
    const currentProductCategory = {
      ProductId: generatedProduct.Id,
      CategoryId: faker.helpers.arrayElement(categoriesListId),
    };
    // eslint-disable-next-line
    await KnexDriver(Tables.ProductCategory).insert(currentProductCategory);
    console.log(currentProductCategory);
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
