"use strict";
const { expect } = require("chai");
const KnexDriver = require("../../driver/KnexDriver");
const Tables = require("../../driver/Table");
const bcrypt = require("bcryptjs");
/**
 * Check whether the response is success
 * @param {*} body the body of response
 */
function hasSuccessfulResponse(body) {
  expect(body).to.haveOwnProperty("status");
  expect(body.status).to.eq("success");
  expect(body).to.haveOwnProperty("data");
  expect(body).to.not.haveOwnProperty("error");
}

/**
 * Check whether the response is error
 * @param {*} body the body of the response
 */
function hasErrorResponse(body) {
  expect(body).to.haveOwnProperty(`status`);
  expect(body.status).to.eq("error");

  // Error contains message
  expect(body).to.haveOwnProperty(`message`);
}

/**
 * Assert that is a user or not
 * @param {*} user a user object to assert
 */
async function isUser(user) {
  const userProperties = [
    "id",
    "phone",
    "email",
    "firstName",
    "lastName",
    "password",
  ];
  for (const property of userProperties) {
    expect(property).not.to.be.undefined;
  }

  // Database response assertion
  /**
   * @type {object}
   */
  const response = await KnexDriver.select("*")
    .from(Tables.Users)
    .where({ Id: user.id })
    .first();

  const responseMapping = {
    Id: "id",
    Phone: "phone",
    Email: "email",
    FirstName: "firstName",
    LastName: "lastName",
    Password: "password",
  };

  // eslint-disable-next-line guard-for-in
  for (const responseProperty in response) {
    if (responseProperty === "Password") {
      // Check password
      expect(bcrypt.compareSync(user.password, response[responseProperty])).to
        .be.true;
      continue;
    }

    expect(response[responseProperty]).to.eq(
      user[responseMapping[responseProperty]],
    );
  }
}

module.exports = {
  hasSuccessfulResponse,
  hasErrorResponse,
  isUser,
};
