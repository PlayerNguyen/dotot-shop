"use strict";
const app = require("../src/index");
const chaiHttp = require("chai-http");
const { expect } = require("chai");
const {
  hasErrorResponse,
  hasSuccessfulResponse,
} = require("./utils/AssertionUtil");
const chai = require("chai");
const { printTrace } = require("./utils/TracePrintUtil");
const { generateDummyUser } = require("./utils/UserUtil");
chai.use(chaiHttp);
const { faker } = require("@faker-js/faker");
const KnexDriver = require("../driver/KnexDriver");
const Tables = require("../driver/Table");

describe("POST /products/product", () => {
  const productCreateEndpoint = "/products/product";
  const testUser = generateDummyUser();
  let generatedUserId;
  let accessToken;
  const generatedProducts = [];

  /**
   * Initialize user
   */
  before((done) => {
    // Register the account first
    chai
      .request(app)
      .post("/users/register")
      .send(testUser)
      .then((response) => {
        expect(response).to.have.status(200);
        hasSuccessfulResponse(response.body);
        expect(response.body.data.id).not.to.be.undefined;
        generatedUserId = response.body.data.id;
      })
      // Login with cached user, return token
      .then(() => {
        chai
          .request(app)
          .post("/auth/login")
          .send({ phoneOrEmail: testUser.email, password: testUser.password })
          .then((response) => {
            expect(response).to.have.status(200);
            hasSuccessfulResponse(response.body);

            expect(response.body.data.token).not.to.be.undefined;

            accessToken = response.body.data.token;

            // console.log(chalk.green(accessToken));
          })
          .catch(printTrace);
      })
      .then(done)
      .catch(printTrace);
  });
  /**
   * Remove the user and clean up after usage
   */
  after((done) => {
    KnexDriver.del()
      .from(Tables.UserProducts)
      .where("UserId", generatedUserId)
      .then((response) => {
        console.log(`Cleaning middle-link ${response} from Product.spec.js...`);
      })

      .then(() => {
        KnexDriver.del()
          .from(Tables.Users)
          .where("Id", generatedUserId)
          .then((response) => {
            console.log(`Cleaning ${response} from Product.spec.js...`);
          })
          .catch(printTrace);
      })
      .then(() => {
        // Assertion is not that type
        KnexDriver.select("*")
          .from(Tables.Users)
          .where("Id", generatedUserId)
          // .then((response) => {
          //   expect(response).to.have.lengthOf.lessThanOrEqual(0);
          // })
          .catch(printTrace);
      })
      .then(() => {
        // Remove products
        KnexDriver.del()
          .from(Tables.Products)
          .whereIn("Id", generatedProducts)
          .then((res) => console.log(`res here ${res}`))
          .catch(printTrace);
      })
      .then(done)
      .catch(printTrace);
  });

  // Unauthorized (non-token) headers
  it("unauthorized request", (done) => {
    chai
      .request(app)
      .post(productCreateEndpoint)
      .then((response) => {
        expect(response).to.have.status(401);
        hasErrorResponse(response.body);

        expect(response.body.message).to.eq("Unauthorized");
        done();
      })
      .catch(printTrace);
  });

  // the body is invalid
  it("invalid body response", (done) => {
    chai
      .request(app)
      .post(productCreateEndpoint)
      .set("Authorization", `JWT ${accessToken}`)
      .then((response) => {
        expect(response).to.have.status(400);
        hasErrorResponse(response.body);
        expect(response.body.message).to.eq("Invalid request body");

        done();
      })
      .catch(printTrace);
  });

  // the name with value less than 5
  it("lower than 5 chars name fail response", (done) => {
    chai
      .request(app)
      .post(productCreateEndpoint)
      .set("Authorization", `JWT ${accessToken}`)
      .send({
        name: faker.word.noun(3),
        price: faker.finance.amount(3, Number.MAX_SAFE_INTEGER),
        description: faker.lorem.paragraphs(),
      })
      .then((response) => {
        expect(response).to.have.status(400);
        hasErrorResponse(response.body);
        expect(response.body.data.errors).not.to.be.undefined;

        expect(response.body.data.errors[0].msg).to.eq(
          "The name length must be greater than 5 characters",
        );

        done();
      })
      .catch(printTrace);
  });

  // price with value greater than 0.0
  it("price lt 0.0 fail response", (done) => {
    chai
      .request(app)
      .post(productCreateEndpoint)
      .set("Authorization", `JWT ${accessToken}`)
      .send({
        name: `${faker.commerce.productAdjective} ${faker.commerce.product}`,
        price: -1.0,
        description: faker.lorem.paragraphs(),
      })
      .then((response) => {
        expect(response).to.have.status(400);
        hasErrorResponse(response.body);
        expect(response.body.data.errors).not.to.be.undefined;

        expect(response.body.data.errors[0].msg).to.eq(
          "The price must be a float and greater than 0.0",
        );

        done();
      })
      .catch(printTrace);
  });

  it("successful create response", (done) => {
    let _productId;
    const product = {
      name: `${faker.commerce.productAdjective()} ${faker.commerce.product()}`,
      price: faker.finance.amount(1, 1000000),
      description: faker.lorem.paragraphs(),
    };
    chai
      .request(app)
      .post(productCreateEndpoint)
      .set("Authorization", `JWT ${accessToken}`)
      .send(product)
      .then((response) => {
        expect(response).to.have.status(200);
        hasSuccessfulResponse(response.body);
        expect(response.body.data.id).not.to.be.undefined;

        generatedProducts.push(response.body.data.id);

        _productId = response.body.data.id;
      })
      .then(() => {
        KnexDriver.select("*")
          .from(Tables.UserProducts)
          .where({ ProductId: _productId, UserId: generatedUserId })
          .first()
          .then((response) => {
            // console.log(`first: `, response);
            expect(response.ProductId).to.be.eq(_productId);
            expect(response.UserId).to.be.eq(generatedUserId);
          })
          .catch(printTrace);
      })
      .then(done)
      .catch(printTrace);
  });
});
