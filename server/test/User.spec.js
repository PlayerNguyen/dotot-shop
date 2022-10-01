"use strict";
const app = require("./../src/index");
const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const { faker } = require("@faker-js/faker");
const { expect } = require("chai");
const {
  hasErrorResponse,
  hasSuccessfulResponse,
} = require("./utils/AssertionUtil");
const chalk = require("chalk");

const endpoint = {
  register: `/users/register`,
};

describe("/users/register", () => {
  const dummyUser = {
    phone: faker.phone.number("0#########"),
    email: faker.internet.email(),
    password: faker.internet.password(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
  };

  before((done) => {
    chai
      .request(app)
      .post(endpoint.register)
      .send(dummyUser)
      .then((response) => {
        expect(response).to.have.status(200);
        hasSuccessfulResponse(response);
        expect(response.body.data).to.haveOwnProperty("id");

        done();
      });
  });

  it(`request body without fields response`, (done) => {
    // Force send without body data
    chai
      .request(app)
      .post(endpoint.register)
      .then((response) => {
        expect(response).to.have.status(400);
        hasErrorResponse(response.body);
        const { errors } = response.body.data;

        expect(errors).instanceOf(Array);
        expect(errors).to.have.lengthOf.above(0);

        done();
      })
      .catch((err) => console.error(chalk.redBright(err.stack)));
  });
  it(``);
});
