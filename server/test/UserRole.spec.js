"use strict";
const app = require("./../src/index");
const chai = require("chai");
const { expect } = require("chai");
const chaiHttp = require("chai-http");
const KnexDriver = require("../driver/KnexDriver");
const { generateDummyUser } = require("./utils/UserUtil");
const { genSaltSync, hashSync } = require("bcryptjs");
const Tables = require("../driver/Table");
const { printTrace } = require("./utils/TracePrintUtil");
const { hasSuccessfulResponse } = require("./utils/AssertionUtil");

chai.use(chaiHttp);
/**
 * TODO: implement this test package
 * - Register, sign up and check for the profile response must have role with admin
 *
 */

describe(`UserRole`, () => {
  const _dummyUser = generateDummyUser();
  let accessToken;
  /**
   * Create an admin account
   */
  before((done) => {
    const password = hashSync(
      _dummyUser.password,
      genSaltSync(Number.parseInt(process.env.BCRYPT_HASH_ROUNDS | 10)),
    );

    KnexDriver.insert({
      id: _dummyUser.id,
      phone: _dummyUser.phone,
      password,
      firstName: _dummyUser.firstName,
      lastName: _dummyUser.lastName,
      email: _dummyUser.email,
    })
      .into(Tables.Users)
      .then(() =>
        KnexDriver.insert({ UserId: _dummyUser.id, Role: "admin" }).into(
          Tables.UserRoles,
        ),
      )
      .then((_response) => {
        // console.log(`inserting `);
      })
      .then(() =>
        chai.request(app).post(`/auth/login`).send({
          phoneOrEmail: _dummyUser.phone,
          password: _dummyUser.password,
        }),
      )
      .then((res) => {
        expect(res).to.have.status(200);
        hasSuccessfulResponse(res.body);
        expect(res.body.data.token).not.to.be.undefined;

        // Set access token for temporarily use
        accessToken = res.body.data.token;
      })
      .then(done)
      .catch(printTrace);
  });

  /**
   * Clean up stuffs
   */
  after((done) => {
    KnexDriver.del()
      .from(Tables.UserRoles)
      .where("UserId", _dummyUser.id)
      .then(() =>
        KnexDriver.del().from(Tables.Users).where("Id", _dummyUser.id),
      )
      .then((res) => {})
      .then(done)
      .catch(printTrace);
  });

  it(`successfully response`, () => {
    chai
      .request(app)
      .get(`/users/profile`)
      .set("Authorization", `JWT ${accessToken}`)
      .then((response) => {
        expect(response).to.have.status(200);
        expect(response.body.data.role).to.eq("admin");
      });
  });
});
