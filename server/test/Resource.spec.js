"use strict";
const app = require("./../src/app");
const chai = require("chai");
const { expect } = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const fs = require("fs");
const path = require("path");
const { hasSuccessfulResponse, isUser } = require("./utils/AssertionUtil");
const {
  removeUserFromDatabase,
  createUserWithAccessToken,
} = require("./utils/UserUtil");

const { default: validator } = require("validator");

describe("POST /resources/", () => {
  let accessToken;
  let accessUser;

  before((done) => {
    createUserWithAccessToken(true)
      .then(async ({ token, user }) => {
        expect(validator.isJWT(token)).to.be.true;
        await isUser(user);

        accessToken = token;
        accessUser = user;
      })
      .then(done)
      .catch(console.error);
  });

  after((done) => {
    Promise.resolve(() => {
      // Clean up the directory after executed test
      fs.rmSync(path.resolve("public"), { force: true, recursive: true });
    })
      .then(() =>
        // Clean up user
        removeUserFromDatabase(accessUser.id),
      )
      .then(done);
  });

  it(`should upload a file and exist file into public directory`, (done) => {
    console.log({ accessToken, accessUser });
    const file = fs.readFileSync(
      path.resolve("server", "test", "samples", "image1.png"),
    );
    chai
      .request(app)
      .post("/resources/")
      .set("content-type", "application/x-www-form-urlencoded")
      .set({ authorization: `JWT ${accessToken}` })
      .attach("images", file, "image1.png")
      .attach("images", file, "image2.png")
      .then((response) => {
        hasSuccessfulResponse(response.body);
      })
      .then(done)
      .catch(console.error);
  });
});
