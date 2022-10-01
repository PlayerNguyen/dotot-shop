"use strict";
const path = require("path");
const fetch = require("node-fetch");
const chalk = require("chalk");
const fs = require("fs");
const driver = require("./../driver/KnexDriver");
const Tables = require("../driver/Table");

const API_URL = "https://provinces.open-api.vn/api/?depth=3";
const SAMPLE_FILE_NAME = path.resolve(".", "..", "samples", "provinces.json");

async function fetchProvinces(overwrite) {
  console.log(chalk.magenta(`Checking before fetch provinces.json file...`));

  console.log(chalk.gray(` Path: ${SAMPLE_FILE_NAME}`));

  // Check file whether exists
  if (fs.existsSync(SAMPLE_FILE_NAME) && overwrite === false) {
    console.log(
      chalk.red(`The file is existed and no overwrite permission granted`),
    );
    return;
  }

  // Make a directory first whether is not possible
  const sampleDirName = path.dirname(SAMPLE_FILE_NAME);
  if (!fs.existsSync(sampleDirName)) {
    fs.mkdirSync(sampleDirName, { recursive: true });
  }

  // Then starting to fetch the file
  console.log(`Fetching and writing a file into ${SAMPLE_FILE_NAME} ...`);
  const response = await fetch(API_URL);
  const data = await response.json();

  // Write response data as a file
  fs.writeFileSync(SAMPLE_FILE_NAME, JSON.stringify(data, null, 0), {
    flag: "w",
  });

  console.log(`Successfully fetch Vietnamese provinces.`);
}

async function supplyProvinces() {
  console.log(`Supplying provinces for database...`);
  const _data = fs.readFileSync(SAMPLE_FILE_NAME, { encoding: "utf-8" });

  const provinces = JSON.parse(_data);

  // provinces.forEach(async (province) => {
  //   console.log({ name: e.name, index: i, districts: e.districts });
  //   // Create if the province is not exist on database
  //   console.log(
  //     await driver
  //       .select("*")
  //       .from(Tables.Provinces)
  //       .where("Id", "=", province.code)
  //   );

  //   // const districts = province.districts;
  //   // districts.forEach((district) => {
  //   //   const wards = district.wards;

  //   //   wards.forEach((ward) => {
  //   //     // console.log({ ward });
  //   //     // Create if the district is not exist on database
  //   //     // Insert if the ward is not exist on database
  //   //   });
  //   // });
  // });

  for (const province of provinces) {
    const provinceExist =
      (
        await driver(Tables.Provinces)
          .select("*")
          .where("Id", "=", province.code)
      ).length !== 0;

    // Insert if the province is not exist
    if (!provinceExist) {
      await driver(Tables.Provinces).insert({
        Id: province.code,
        Name: province.name,
      });
    }

    // Iterate to create districts
    for (const district of province.districts) {
      const districtExist =
        (
          await driver(Tables.Districts)
            .select("*")
            .where("Id", "=", district.code)
        ).length !== 0;

      // Insert if the province is not exist
      if (!districtExist) {
        await driver(Tables.Districts).insert({
          Id: district.code,
          Name: district.name,
          ProvinceId: province.code,
        });
      }

      // Iterate to create wards
      for (const ward of district.wards) {
        const wardExist =
          (await driver(Tables.Wards).select("*").where("Id", "=", ward.code))
            .length !== 0;

        // Insert if the ward is not exist
        if (!wardExist) {
          await driver(Tables.Wards).insert({
            Id: ward.code,
            Name: ward.name,
            DistrictId: district.code,
          });
        }
      }
    }
  }
}

/**
 * Fetching the API from url and store .json file for creating
 */
(async (overwrite) => {
  await fetchProvinces(overwrite);
  await supplyProvinces().catch(console.error);
  // await driver.schema.hasTable("Users");
})(process.env.PROVINCE_FETCH_OVERWRITE || false)
  .catch(console.error)
  .then(process.exit);
