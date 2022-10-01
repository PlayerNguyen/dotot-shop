"use strict";
const app = require("./../src/index");
const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const { faker } = require("@faker-js/faker");
const { expect } = require("chai");
const { hasErrorResponse } = require("./utils/AssertionUtil");
const chalk = require("chalk");
const KnexDriver = require("../driver/KnexDriver");
const Tables = require("../driver/Table");
const { v4: uuid } = require("uuid");

const endpoint = {
  register: `/users/register`,
};

const handleError = (err) => {
  console.error(chalk.red(err.stack));
};

describe("/users/register", () => {
  const dummyUser = {
    id: uuid(),
    phone: faker.phone.number("0#########"),
    email: faker.internet.email(),
    password: faker.internet.password(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
  };

  before((done) => {
    // chai
    //   .request(app)
    //   .post(endpoint.register)
    //   .send(dummyUser)
    //   .then((response) => {
    //     expect(response).to.have.status(200);
    //     hasSuccessfulResponse(response.body);
    //     expect(response.body.data).to.haveOwnProperty("id");

    //     done();
    //   })
    //   .catch(console.error);

    KnexDriver.insert(dummyUser)
      .into(Tables.Users)
      .then((res) => {
        if (res.length === 1 && res[0] === 0) {
          done();
        }
      })
      .catch(handleError);
  });

  after((done) => {
    KnexDriver.del()
      .from(Tables.Users)
      .where({ id: uuid() })
      .then(() => {
        done();
      })
      .catch(handleError);
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
      .catch(handleError);
  });
  it(`register with existed user response`, (done) => {
    chai
      .request(app)
      .post(endpoint.register)
      .send(dummyUser)
      .then((res) => {
        expect(res).to.have.status(409);
        hasErrorResponse(res.body);
        expect(res.body.message).to.eq("User with phone or email is found");

        done();
      })
      .catch(handleError);
  });
});
