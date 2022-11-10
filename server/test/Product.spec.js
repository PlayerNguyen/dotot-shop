"use strict";
const app = require("../src/app");
const chaiHttp = require("chai-http");
const chai = require("chai");
const { expect } = require("chai");
const {
  hasErrorResponse,
  hasSuccessfulResponse,
} = require("./utils/AssertionUtil");

const { printTrace } = require("./utils/TracePrintUtil");
const {
  generateDummyUser,
  createUserIntoDatabase,
  removeUserFromDatabase,
} = require("./utils/UserUtil");
const { faker } = require("@faker-js/faker");
const { v4: uuid } = require("uuid");

chai.use(chaiHttp);
const KnexDriver = require("../driver/KnexDriver");
const Tables = require("../driver/Table");
const {
  createDatabaseProduct,
  removeDatabaseProduct,
} = require("./utils/ProductUtil");
/**
 * Generate a random value product for test
 * @return {Object} a dummy product to test
 */
function createDummyProduct() {
  return {
    name: `${faker.commerce.productAdjective()} ${faker.commerce.product()}`,
    price: faker.finance.amount(1, 1000000),
    description: faker.lorem.paragraphs(),
  };
}

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
      .then(() =>
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
          }),
      )
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

      .then(() =>
        KnexDriver.del()
          .from(Tables.Users)
          .where("Id", generatedUserId)
          .then((response) => {
            console.log(`Cleaning ${response} from Product.spec.js...`);
          }),
      )
      .then(() => {})
      .then(() =>
        // Assertion is not that type
        KnexDriver.select("*").from(Tables.Users).where("Id", generatedUserId),
      )
      .then(
        () =>
          // Remove products
          KnexDriver.del()
            .from(Tables.Products)
            .whereIn("Id", generatedProducts),
        // .then((res) => console.log(`res here ${res}`)),
      )
      .then(() => {})
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
    const product = createDummyProduct();
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
      .then(() =>
        KnexDriver.select("*")
          .from(Tables.UserProducts)
          .where({ ProductId: _productId, UserId: generatedUserId })
          .first()
          .then((response) => {
            expect(response.ProductId).to.be.eq(_productId);
            expect(response.UserId).to.be.eq(generatedUserId);
          }),
      )
      .then(done)
      .catch(printTrace);
  });
});

describe("GET /products/product/:productId", () => {
  const dummyProduct = createDummyProduct();
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
      .then(() =>
        chai
          .request(app)
          .post("/auth/login")
          .send({ phoneOrEmail: testUser.email, password: testUser.password }),
      )
      .then((response) => {
        expect(response).to.have.status(200);
        hasSuccessfulResponse(response.body);

        expect(response.body.data.token).not.to.be.undefined;

        accessToken = response.body.data.token;
        // console.log(`access Token`, accessToken);
      })
      // Create a product
      .then(() =>
        chai
          .request(app)
          .post("/products/product")
          .set("Authorization", `JWT ${accessToken}`)
          .send(dummyProduct),
      )
      .then((response) => {
        expect(response).to.have.status(200);
        hasSuccessfulResponse(response.body);

        expect(response.body.data.id).not.to.be.undefined;
        generatedProducts.push(response.body.data.id);
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
      .then(() =>
        KnexDriver.del()
          .from(Tables.Users)
          .where("Id", generatedUserId)
          .then((response) => {
            console.log(`Cleaning ${response} from Product.spec.js...`);
          }),
      )
      .then(() => {})
      .then(() =>
        // Assertion is not that type
        KnexDriver.select("*").from(Tables.Users).where("Id", generatedUserId),
      )
      .then(
        () =>
          // Remove products
          KnexDriver.del()
            .from(Tables.Products)
            .whereIn("Id", generatedProducts),
        // .then((res) => console.log(`res here ${res}`)),
      )
      .then(() => {})
      .then(done)
      .catch(printTrace);
  });

  it(`unknown product fail response`, (done) => {
    chai
      .request(app)
      .get(`/products/product/${uuid()}`)
      .then((response) => {
        expect(response).to.have.status(404);
        hasErrorResponse(response.body);
        expect(response.body.message).to.be.eq("Product not found");
      })
      .then(done)
      .catch(printTrace);
  });
  it(`success response`, (done) => {
    chai
      .request(app)
      .get(`/products/product/${generatedProducts[0]}`)
      .then((response) => {
        expect(response).to.have.status(200);
        hasSuccessfulResponse(response.body);

        // eslint-disable-next-line
        const { name, price, description, views, likes, user } =
          response.body.data;

        expect(name).to.eq(dummyProduct.name);
        expect(price).to.closeTo(Number.parseFloat(dummyProduct.price), 0.1);
        expect(description).to.eq(dummyProduct.description);
        expect(views).to.eq(0);
        expect(likes).to.eq(0);

        expect(user).not.to.be.undefined;
        // Check if the same user with creator
        expect(user.id).to.eq(generatedUserId);
        expect(user.firstName).to.eq(testUser.firstName);
        expect(user.lastName).to.eq(testUser.lastName);
      })
      .then(done)
      .catch(printTrace);
  });
  it(`not uuid fail response`, (done) => {
    chai
      .request(app)
      .get(`/products/product/${faker.word.adjective()}`)
      .set("Authorization", `JWT ${accessToken}`)
      .then((response) => {
        expect(response).to.have.status(400);
        hasErrorResponse(response.body);

        expect(response.body.message).to.eq("Invalid parameter");
      })
      .then(done)
      .catch(printTrace);
  });
});

describe("DELETE /products/product/:productId", () => {
  const dummyProduct = createDummyProduct();
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
      .then(() =>
        chai
          .request(app)
          .post("/auth/login")
          .send({ phoneOrEmail: testUser.email, password: testUser.password }),
      )
      .then((response) => {
        expect(response).to.have.status(200);
        hasSuccessfulResponse(response.body);

        expect(response.body.data.token).not.to.be.undefined;

        accessToken = response.body.data.token;
        // console.log(`access Token`, accessToken);
      })
      // Create a product
      .then(() =>
        chai
          .request(app)
          .post("/products/product")
          .set("Authorization", `JWT ${accessToken}`)
          .send(dummyProduct),
      )
      .then((response) => {
        expect(response).to.have.status(200);
        hasSuccessfulResponse(response.body);

        expect(response.body.data.id).not.to.be.undefined;
        generatedProducts.push(response.body.data.id);
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
        // console.log(`Cleaning middle-link ${response} from Product.spec.js...`);
      })
      .then(() =>
        KnexDriver.del()
          .from(Tables.UserRoles)
          .where("UserId", generatedUserId),
      )
      .then(() =>
        KnexDriver.del().from(Tables.Users).where("Id", generatedUserId),
      )
      .then(() => {})
      .then(() =>
        // Assertion is not that type
        KnexDriver.select("*").from(Tables.Users).where("Id", generatedUserId),
      )
      .then(
        () =>
          // Remove products
          KnexDriver.del()
            .from(Tables.Products)
            .whereIn("Id", generatedProducts),
        // .then((res) => console.log(`res here ${res}`)),
      )
      .then(() => {})
      .then(done)
      .catch(printTrace);
  });
  it(`unauthorized access`, (done) => {
    chai
      .request(app)
      .delete(`/products/product/${generatedProducts[0]}`)
      .then((response) => {
        expect(response).to.have.status(401);

        hasErrorResponse(response.body);
        expect(response.body.message).to.eq("Unauthorized");
      })
      .then(done)
      .catch(printTrace);
  });

  it(`no permission response`, (done) => {
    chai
      .request(app)
      .delete(`/products/product/${generatedProducts[0]}`)
      .set("Authorization", `JWT ${accessToken}`)
      .then((response) => {
        expect(response).to.have.status(401);
        hasErrorResponse(response.body);
        expect(response.body.message).to.eq(
          `You have no permission to do this action`,
        );
      })
      .then(done)
      .catch(printTrace);
  });

  it(`successfully without admin permission response`, (done) => {
    // Set admin for all
    KnexDriver.insert({ UserId: generatedUserId, Role: "admin" })
      .into(Tables.UserRoles)
      .then((response) => {})
      .then(() =>
        chai
          .request(app)
          .delete(`/products/product/${generatedProducts[0]}`)
          .set("Authorization", `JWT ${accessToken}`),
      )
      .then((response) => {
        expect(response).to.have.status(401);
        hasErrorResponse(response.body);
        expect(response.body.message).to.eq(
          `You have no permission to do this action`,
        );
      })
      .then(done)
      .catch(printTrace);
  });
});

/**
 * Update product using its productId
 */
describe("PUT /products/product/:productId", () => {
  let _user;
  let _product;
  let accessToken;
  before((done) => {
    createUserIntoDatabase(true)
      .then((user) => {
        _user = user;
      })
      .then(() => {
        console.log(`user `, _user);
      })
      .then(() =>
        chai
          .request(app)
          .post(`/auth/login`)
          .send({ phoneOrEmail: _user.email, password: _user.password }),
      )
      .then((response) => {
        expect(response).to.have.status(200);
        hasSuccessfulResponse(response.body);

        // Set access token
        accessToken = response.body.data.token;
      })
      .then(() => createDatabaseProduct(_user.id))
      .then((product) => {
        _product = product;
      })
      .then(done)
      .catch(printTrace);
  });

  after((done) => {
    removeDatabaseProduct(_product.Id)
      .then(() => removeUserFromDatabase(_user.id))
      .then(done)
      .catch(printTrace);
  });

  it(`un-authorization access response`, (done) => {
    chai
      .request(app)
      .put(`/products/product/${_product.Id}`)

      .then((response) => {
        expect(response).to.have.status(401);
        hasErrorResponse(response.body);
      })
      .then(done)
      .catch(printTrace);
  });

  it(`not found product response`, (done) => {
    chai
      .request(app)
      .put(`/products/product/${uuid()}`)
      .set("Authorization", `JWT ${accessToken}`)
      .then((response) => {
        expect(response).to.have.status(404);
        hasErrorResponse(response.body);
      })
      .then(done)
      .catch(printTrace);
  });

  it(`empty-requested body response`, (done) => {
    chai
      .request(app)
      .put(`/products/product/${_product.Id}`)
      .set("Authorization", `JWT ${accessToken}`)
      .then((response) => {
        expect(response).to.have.status(400);
        hasErrorResponse(response.body);

        expect(response.body.message).to.eq("Invalid parameter");
      })
      .then(done)
      .catch(printTrace);
  });
});
