"use strict";

const app = require("./../src/index");
const chai = require("chai");

const chaiHttp = require("chai-http");

const KnexDriver = require("../driver/KnexDriver");
const Tables = require("../driver/Table");
const chalk = require("chalk");

const { expect } = require("chai");
const { printTrace } = require("./utils/TracePrintUtil");
const { generateDummyUser } = require("./utils/UserUtil");
const {
  hasSuccessfulResponse,
  hasErrorResponse,
} = require("./utils/AssertionUtil");
const { faker } = require("@faker-js/faker");

const validator = require("validator");

chai.use(chaiHttp);

describe("/auth/login/", () => {
  const user = generateDummyUser();
  const authEndpoint = "/auth/login/";

  /**
   * Put the user into the database before running test
   */
  before(async () => {
    console.log(
      chalk.gray(`Inserting user ${JSON.stringify(user)} into users table`),
    );
    await KnexDriver.insert(user).into(Tables.Users);

    const res = await KnexDriver.select("*")
      .from(Tables.Users)
      .where("Id", user.id);
    expect(res.length).above(0);
  });

  after(async () => {
    const affects = await KnexDriver.delete()
      .from(Tables.Users)
      .where("Id", user.id);
    expect(affects).to.eq(1);
  });

  it(`missing fields error response`, (done) => {
    chai
      .request(app)
      .post(authEndpoint)
      .then((response) => {
        expect(response).to.have.status(400);
        hasErrorResponse(response.body);
        expect(response.body.data).to.not.be.undefined;
        expect(response.body.data.errors).instanceOf(Array);
        expect(response.body.data.errors).to.lengthOf.above(0);

        done();
      })
      .catch(printTrace);
  });

  it(`empty user response`, (done) => {
    chai
      .request(app)
      .post(authEndpoint)
      .send({
        phoneOrEmail: faker.internet.email(),
        password: faker.internet.password(),
      })
      .then((response) => {
        expect(response).to.have.status(404);
        hasErrorResponse(response.body);
        expect(response.body.message).to.eq("User not found");

        done();
      })
      .catch(printTrace);
  });

  it(`wrong password response`, (done) => {
    chai
      .request(app)
      .post(authEndpoint)
      .send({
        phoneOrEmail: user.email,
        password: faker.internet.password(),
      })
      .then((response) => {
        expect(response).to.have.status(401);
        hasErrorResponse(response.body);

        expect(response.body.message).to.eq("Password not match");

        done();
      })
      .catch(printTrace);
  });

  it(`sign in using email`, (done) => {
    chai
      .request(app)
      .post(authEndpoint)
      .send({ phoneOrEmail: user.email, password: user.password })
      .then((response) => {
        expect(response).to.have.status(200);
        hasSuccessfulResponse(response.body);
        expect(validator.default.isJWT(response.body.data.token)).to.be.true;

        done();
      })
      .catch(printTrace);
  });
});
