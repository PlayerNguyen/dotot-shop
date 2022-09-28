const { expect } = require("chai");

function hasSuccessfulResponse(body) {
  expect(body).to.haveOwnProperty("status");
  expect(body.status).to.eq("success");
  expect(body).to.haveOwnProperty("data");
  expect(body).to.not.haveOwnProperty("error");
}

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
