const app = require("./../src/index");
const chai = require("chai");
const chaiHttp = require("chai-http");

const { expect } = require("chai");

chai.use(chaiHttp);

function haveSuccessfulResponse(which) {
  expect(which).to.haveOwnProperty("status");
  expect(which.status).to.eq("success");
  expect(which).to.haveOwnProperty("data");
  expect(which).to.not.haveOwnProperty("error");
}

function haveErrorResponse(which) {
  expect(which).to.haveOwnProperty(`status`);
  expect(which.status).to.eq("error");

  // Error contains message
  expect(which).to.haveOwnProperty(`message`);
}

describe("/provinces/", async function testAllProvinces() {
  it("should successfully response province", (done) => {
    chai
      .request(app)
      .get("/provinces/")
      .then((response) => {
        expect(response).to.have.status(200);
        haveSuccessfulResponse(response.body);
        done();
      })
      .catch(console.error);
  });
});

describe("/provinces/province/:provinceId", async function testSelectSpecificProvince() {
  let provinceList = [];
  before("retrieves data from provinces list", (done) => {
    chai
      .request(app)
      .get("/provinces/")
      .then((response) => {
        // Must success status 200
        expect(response).to.have.status(200);

        let provinceResponseData = response.body.data;

        // Validate response data
        expect(provinceResponseData).to.not.be.undefined;
        expect(provinceResponseData).to.be.an("array");
        expect(provinceResponseData).to.have.length.greaterThan(0);

        provinceResponseData.forEach((_) => provinceList.push(_));
        done();
      })
      .catch(console.error);
  });

  it(`should successfully response when retrieving a province with id`, (done) => {
    let { Id, Name } = provinceList[0];

    chai
      .request(app)
      .get(`/provinces/province/${Id}`)
      .then((res) => {
        expect(res).to.have.status(200);
        haveSuccessfulResponse(res.body);

        expect(res.body.data).to.haveOwnProperty("Id");
        expect(res.body.data).to.haveOwnProperty("Name");

        expect(res.body.data.Name).to.eq(Name);
        expect(res.body.data.Id).to.eq(Id);
        done();
      })
      .catch(console.error);
  });

  it(`should failed response if not found province from id`, (done) => {
    let dummyId = provinceList.length;

    chai
      .request(app)
      .get(`/provinces/province/${dummyId}`)
      .then((res) => {
        expect(res).to.have.status(404);

        haveErrorResponse(res.body);

        expect(res.body.message).to.contains("not found");
        done();
      })
      .catch(console.error);
  });
});

describe("/province/:provinceId/districts", async function testAllDistricts() {
  let provinceList = [];
  before("retrieves data from provinces list", (done) => {
    chai
      .request(app)
      .get("/provinces/")
      .then((response) => {
        // Must success status 200
        expect(response).to.have.status(200);

        let provinceResponseData = response.body.data;

        // Validate response data
        expect(provinceResponseData).to.not.be.undefined;
        expect(provinceResponseData).to.be.an("array");
        expect(provinceResponseData).to.have.length.greaterThan(0);

        provinceResponseData.forEach((_) => provinceList.push(_));
        done();
      })
      .catch(console.error);
  });

  it(`should successfully response districts from province id`, (done) => {
    let { Id, Name } = provinceList[0];

    chai
      .request(app)
      .get(`/provinces/province/${Id}/districts`)
      .then((res) => {
        console.log(res.body);
        expect(res).to.have.status(200);

        haveSuccessfulResponse(res.body);

        expect(res.body.data).to.haveOwnProperty("Id");
        expect(res.body.data).to.haveOwnProperty("Name");

        expect(res.body.data.Name).to.eq(Name);
        expect(res.body.data.Id).to.eq(Id);
        done();
      });
  });
});
