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
const KnexDriver = require("../driver/KnexDriver");
const Tables = require("../driver/Table");
const { v4: uuid } = require("uuid");
const bcryptjs = require("bcryptjs");

const endpoint = {
  register: `/users/register`,
  getUser: `/users/`,
};

const handleError = (err) => {
  console.error(chalk.red(err.stack));
};

/**
 *
 * @deprecated using UserUtil.js#generateDummyUser instead
 * @return {Object} an object literal of generated user fields
 */
const generateDummyUser = () => {
  const id = uuid();
  return {
    id,
    phone: faker.phone.number("0#########"),
    email: faker.internet.email(),
    password: faker.internet.password(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
  };
};

describe("/users/register", () => {
  const dummyUser = generateDummyUser();
  const historyUserIds = [];
  before((done) => {
    KnexDriver.insert(dummyUser)
      .into(Tables.Users)
      .then((res) => {
        if (res.length === 1 && res[0] === 0) {
          historyUserIds.push(dummyUser.id);

          done();
        }
      })
      .catch(handleError);
  });

  after((done) => {
    // Clean history users
    console.log([...historyUserIds]);
    // Then handle all history users
    KnexDriver.from(Tables.Users)
      .whereIn("Id", [...historyUserIds])
      .del()
      .then((response) => {
        console.log(`Clean up ~ removing ${response} row(s)`);

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
  it(`password format must be bcryptjs`, (done) => {
    const genUser = generateDummyUser();
    let generatedUniqueId;
    chai
      .request(app)
      .post(endpoint.register)
      .send(genUser)
      .then((response) => {
        expect(response).to.have.status(200);
        hasSuccessfulResponse(response.body);

        expect(response.body.data).to.haveOwnProperty("id");
        historyUserIds.push(response.body.data.id);
        generatedUniqueId = response.body.data.id;
      })
      .then(() => {
        // Password must match with bcryptjs

        KnexDriver.select("*")
          .from(Tables.Users)
          .where("Id", generatedUniqueId)
          .then((_response) => {
            // console.log(`_response`, _response);
            const curResponseUser = _response[0];
            expect(
              bcryptjs.compareSync(genUser.password, curResponseUser.Password),
            ).to.be.true;
          })
          .catch(handleError);
      })
      .then(done)
      .catch(handleError);
  });

  it(`success register response`, (done) => {
    const genUser = generateDummyUser();

    chai
      .request(app)
      .post(endpoint.register)
      .send(genUser)
      .then((response) => {
        expect(response).to.have.status(200);
        hasSuccessfulResponse(response.body);

        expect(response.body.data).to.haveOwnProperty("id");
        historyUserIds.push(response.body.data.id);

        // Password must match with bcryptjs
        done();
      })
      .catch(handleError);
  });
});

describe("/users/:userId", () => {
  const dummyUser = generateDummyUser();
  let generatedUserId;
  before((done) => {
    KnexDriver.insert(dummyUser)
      .into(Tables.Users)
      .then((res) => {
        if (res.length === 1 && res[0] === 0) {
          generatedUserId = dummyUser.id;
          done();
        }
      })
      .catch(handleError);
  });
  after((done) => {
    // Then handle all history users
    KnexDriver.from(Tables.Users)
      .where("Id", generatedUserId)
      .del()
      .then((response) => {
        console.log(`Clean up ~ removing ${response} row(s)`);

        done();
      })
      .catch(handleError);
  });

  it(`user not found 404 response`, (done) => {
    chai
      .request(app)
      .get(`${endpoint.getUser}${uuid()}`)
      .then((response) => {
        expect(response).to.have.status(404);
        hasErrorResponse(response.body);

        done();
      })
      .catch(handleError);
  });

  it(`successfully get user with 200 response`, (done) => {
    chai
      .request(app)
      .get(`${endpoint.getUser}${generatedUserId}`)
      .then((response) => {
        expect(response).to.have.status(200);
        hasSuccessfulResponse(response.body);

        const { data } = response.body;

        expect(data).to.haveOwnProperty("id");
        expect(data).to.haveOwnProperty("firstName");
        expect(data).to.haveOwnProperty("lastName");

        const { id, firstName, lastName } = data;
        expect(id).to.eq(dummyUser.id);
        expect(firstName).to.eq(dummyUser.firstName);
        expect(lastName).to.eq(dummyUser.lastName);

        done();
      })
      .catch(hasErrorResponse);
  });
});
