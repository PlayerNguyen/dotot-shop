"use strict";
require("dotenv").config();

const KnexDriver = require("../driver/KnexDriver");
const {faker} = require("@faker-js/faker")

for (let i = 0; i < 1000; i++) {

  KnexDriver('localhost.Products').insert(
    {
      Id: i,
      Name: faker.commerce.productName(),
      Price:faker.commerce.price(),
      Description: faker.commerce.productDescription(),
    }
    )

  }
  process.exit

 