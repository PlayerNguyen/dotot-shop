"use strict";
const { faker } = require("@faker-js/faker");
const { v4: uuid } = require("uuid");
/**
 * Generate a custom user. Using for testing
 *
 * @return {Object} a dummy user as a object literal
 */
function generateDummyUser() {
  const id = uuid();
  return {
    id,
    phone: faker.phone.number("0#########"),
    email: faker.internet.email(),
    password: faker.internet.password(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
  };
}

module.exports = { generateDummyUser };
