"use strict";
const { faker } = require("@faker-js/faker");
const { genSaltSync, hashSync } = require("bcryptjs");
const { v4: uuid } = require("uuid");
const KnexDriver = require("../../driver/KnexDriver");
const Tables = require("../../driver/Table");
const { isUUID } = require("validator");
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

/**
 *
 * @param {boolean} admin is admin or not
 * @return {*} the promise after resolved
 */
async function createUserIntoDatabase(admin) {
  if (!(typeof admin === "boolean")) {
    throw new Error(`Invalid parameter admin`);
  }

  const _user = generateDummyUser();

  // Generate salt for hashing password
  const salt = genSaltSync(
    Number.parseInt(process.env.BCRYPT_HASH_ROUNDS || 10),
  );
  const hashedPassword = hashSync(_user.password, salt);

  // Directly put into database
  await KnexDriver.insert({ ..._user, password: hashedPassword }).into(
    Tables.Users,
  );

  // Whether user is an admin, create a role for that users
  if (admin) {
    await KnexDriver.insert({ UserId: _user.id, Role: "admin" }).into(
      Tables.UserRoles,
    );
  }

  return _user;
}

/**
 *  Remove user out of database using id
 * @param {*} id the user id to remove
 * @return {Promise} a promise resolve removed function
 */
async function removeUserFromDatabase(id) {
  if (!(typeof id === "string" && isUUID(id))) {
    throw new Error(`invalid id parameter, it must be uuid`);
  }
  // remove roles
  await KnexDriver.del().from(Tables.UserRoles).where("UserId", id);

  // remove user
  await KnexDriver.del().from(Tables.Users).where("Id", id);
}

module.exports = {
  generateDummyUser,
  createUserIntoDatabase,
  removeUserFromDatabase,
};
