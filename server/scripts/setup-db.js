"use strict";
const chalk = require("chalk");
const Tables = require("../driver/Table");
const driver = require("./../driver/KnexDriver");

/**
 * Check whether the table exists and create it
 *
 * @param {*} tableName a table name to create
 * @param {*} callback a callback response after generated
 */
async function createTableIfNotExists(tableName, callback) {
  try {
    if (!(await driver.schema.hasTable(tableName))) {
      console.log(chalk.gray(` • Creating table with name ${tableName}...`));
      await driver.schema.createTable(tableName, callback);
    }
  } catch (e) {
    throw e;
  }
}

/**
 * Setup and generate tables
 */
async function setupDatabase() {
  await createTableIfNotExists(Tables.Users, (userTable) => {
    userTable.string("Id").notNullable().primary().unique();
    userTable.string("Password").notNullable();
    userTable.string("Email").notNullable();
    userTable.string("FirstName").notNullable();
    userTable.string("LastName").notNullable();
    userTable.string("Phone").notNullable();
  });

  await createTableIfNotExists(Tables.Provinces, (table) => {
    table.integer("Id").primary().notNullable().unique();
    table.string("Name").notNullable();
  });

  await createTableIfNotExists(Tables.Districts, (table) => {
    table.integer("Id", 8).primary().notNullable().unique();
    table.string("Name").notNullable();
    table
      .integer("ProvinceId", 8)
      .notNullable()
      .references(`${Tables.Provinces}.Id`);
  });

  await createTableIfNotExists(Tables.Wards, (t) => {
    t.integer("Id").primary().notNullable().unique();
    t.string("Name").notNullable();
    t.integer("DistrictId").notNullable().references(`${Tables.Districts}.Id`);
  });

  await createTableIfNotExists(Tables.Products, (table) => {
    table.string("Id").primary().notNullable().unique();
    table.string("Name").notNullable();
    table.float("Price").notNullable();
    table.text("Description");

    // Statistic
    table.integer("Views").defaultTo(0);
    table.integer("Likes").defaultTo(0);
  });

  await createTableIfNotExists(Tables.Categories, (table) => {
    table.primary(["Id"]);
    table.increments("Id");
    table.string("Name").notNullable();
    table.string("Slug").notNullable();
    table.string("Description").notNullable();
  });

  await createTableIfNotExists(Tables.ProductCategory, (table) => {
    table.string("ProductId").notNullable().references(`${Tables.Products}.Id`);
    table
      .integer("CategoryId")
      .unsigned()
      .notNullable()
      .references(`${Tables.Categories}.Id`);
  });
}

(async () => {
  console.log(chalk.magenta(`[-] Database setting up...`));

  await setupDatabase();

  // require("./fetch-provinces");
})()
  .then(process.exit)
  .catch((err) => {
    console.error(chalk.red(err.stack));
  });
