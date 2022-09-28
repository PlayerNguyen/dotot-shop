"use strict";
const app = require("./../src/index");
const chai = require("chai");
const chaiHttp = require("chai-http");
const { expect } = require("chai");
const {
  hasSuccessfulResponse,
  hasErrorResponse,
} = require("./utils/AssertionUtil");

chai.use(chaiHttp);

describe("/provinces/", async function testAllProvinces() {
  it("should successfully response province", (done) => {
    chai
      .request(app)
      .get("/provinces/")
      .then((response) => {
        expect(response).to.have.status(200);
        hasSuccessfulResponse(response.body);

        done();
      })
      .catch(console.error);
  });
});

describe("/provinces/province/:provinceId", async function testSelectSpecificProvince() {
  const provinceList = [];
  before("retrieves data from provinces list", (done) => {
    chai
      .request(app)
      .get("/provinces/")
      .then((response) => {
        // Must success status 200
        expect(response).to.have.status(200);

        const provinceResponseData = response.body.data;

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
    const { Id, Name } = provinceList[0];

    chai
      .request(app)
      .get(`/provinces/province/${Id}`)
      .then((res) => {
        expect(res).to.have.status(200);
        hasSuccessfulResponse(res.body);

        expect(res.body.data).to.haveOwnProperty("Id");
        expect(res.body.data).to.haveOwnProperty("Name");

        expect(res.body.data.Name).to.eq(Name);
        expect(res.body.data.Id).to.eq(Id);
        done();
      })
      .catch(console.error);
  });

  it(`should failed response if not found province from id`, (done) => {
    const dummyId = provinceList.length;

    chai
      .request(app)
      .get(`/provinces/province/${dummyId}`)
      .then((res) => {
        expect(res).to.have.status(404);

        hasErrorResponse(res.body);

        expect(res.body.message).to.contains("not found");
        done();
      })
      .catch(console.error);
  });
});

describe("/provinces/province/:provinceId/districts", async function testAllDistricts() {
  const provinceList = [];
  before("retrieves data from provinces list", (done) => {
    chai
      .request(app)
      .get("/provinces/")
      .then((response) => {
        // Must success status 200
        hasSuccessfulResponse(response.body);

        const provinceResponseData = response.body.data;

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
    const { Id } = provinceList[0];

    chai
      .request(app)
      .get(`/provinces/province/${Id}/districts`)
      .then((response) => {
        hasSuccessfulResponse(response.body);
        expect(response.body).to.be.instanceOf(Object);
        expect(response.body.status).to.eq("success");
        expect(response.body.data).to.be.instanceOf(Array);
        expect(response.body.data).to.have.lengthOf.gt(0);

        done();
      })
      .catch(console.error);
  });

  it(`should failed response districts from undefined province id`, (done) => {
    const Id = Number.MAX_SAFE_INTEGER;

    chai
      .request(app)
      .get(`/provinces/province/${Id}/districts`)
      .then((response) => {
        hasErrorResponse(response.body);
        done();
      })
      .catch(console.error);
  });
});

describe("/district/:districtId/wards", () => {
  let currentProvince;
  let currentDistrict;

  before((done) => {
    chai
      .request(app)
      .get("/provinces/")
      .then((response) => {
        // Must success status 200
        expect(response).to.have.status(200);

        const provinceResponseData = response.body.data;

        // Validate response data
        expect(provinceResponseData).to.not.be.undefined;
        expect(provinceResponseData).to.be.an("array");
        expect(provinceResponseData).to.have.length.greaterThan(0);

        currentProvince = provinceResponseData[provinceResponseData.length - 1];
      })
      .then(async () => {
        // done();

        chai
          .request(app)
          .get(`/provinces/province/${currentProvince.Id}/districts`)
          .then((res) => {
            expect(res).to.have.status(200);
            expect(res.body.data).to.instanceOf(Array);
            expect(res.body.data).to.have.lengthOf.greaterThan(0);

            currentDistrict = res.body.data[0];
            done();
          });
        // await done();
      })
      .catch(console.error);
  });

  it(`successfully response when get wards`, async () => {
    const res = await chai
      .request(app)
      .get(`/provinces/district/${currentDistrict.Id}/wards`);

    // Must response 200
    // console.log(res.body);
    hasSuccessfulResponse(res.body);
    expect(res.data).to.not.be.null;
  });
});
