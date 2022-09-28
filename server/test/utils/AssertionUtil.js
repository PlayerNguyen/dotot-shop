"use strict";
const { expect } = require("chai");

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

module.exports = {
  hasSuccessfulResponse,
  hasErrorResponse,
};
