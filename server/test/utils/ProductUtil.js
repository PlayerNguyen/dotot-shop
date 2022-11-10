"use strict";
const { faker } = require("@faker-js/faker");
const { v4: uuid } = require("uuid");
const KnexDriver = require("../../driver/KnexDriver");
const Tables = require("../../driver/Table");
const { isUUID } = require("validator");
/**
 * Generate a random value product for test
 * @return {Object} a dummy product to test
 */
function createDummyProduct() {
  return {
    name: `${faker.commerce.productAdjective()} ${faker.commerce.product()}`,
    price: faker.finance.amount(1, 1000000),
    description: faker.lorem.paragraphs(),
  };
}

/**
 * Create a new row database product
 *
 * @param {any} userId a user id to insert product owner
 */
async function createDatabaseProduct(userId) {
  // Insert the product
  let product = createDummyProduct();
  product = { ...product, Id: uuid() };

  await KnexDriver.insert(product).into(Tables.Products);

  // Insert user product
  await KnexDriver.insert({
    UserId: userId,
    ProductId: product.Id,
  }).into(Tables.UserProducts);

  return product;
}
/**
 * Remove out of database
 * @param {*} productId a product id to remove
 */
async function removeDatabaseProduct(productId) {
  if (!(typeof productId === "string" && isUUID(productId))) {
    throw new Error("Product id must be an UUID");
  }
  await KnexDriver.del()
    .from(Tables.UserProducts)
    .where("ProductId", productId);
  await KnexDriver.del().from(Tables.Products).where("Id", productId);
}
module.exports = { createDatabaseProduct, removeDatabaseProduct };
