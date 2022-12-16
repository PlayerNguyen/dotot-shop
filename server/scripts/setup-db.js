"use strict";
const chalk = require("chalk");
const Tables = require("../driver/Table");
const driver = require("./../driver/KnexDriver");

// eslint-disable-next-line
const { Knex } = require("knex");
/**
 * @callback CreateTableCallback
 * @param {Knex.CreateTableBuilder} tableBuilder
 */
/**
 * Check whether the table exists and create it
 *
 * @param {*} tableName a table name to create
 * @param {CreateTableCallback} callback a callback response after generated
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
    userTable.primary(["Id", "Phone", "Email"]);
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
    // Order
    table.bigInteger("CreatedAt").notNullable();
    table.string("Condition").notNullable();
  });

  await createTableIfNotExists(Tables.SaleProducts, (table) => {
    table
      .string("ProductId")
      .primary()
      .unique()
      .references(`${Tables.Products}.Id`);
    table.float("SalePrice");
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

  await createTableIfNotExists(Tables.UserProducts, (table) => {
    table.string("UserId").notNullable().references(`${Tables.Users}.Id`);
    table.string("ProductId").notNullable().references(`${Tables.Products}.Id`);
  });

  await createTableIfNotExists(Tables.UserRoles, (table) => {
    table.string("UserId").notNullable().references(`${Tables.Users}.Id`);
    table.enu("Role", [`admin`, `moderate`]);
  });

  await createTableIfNotExists(Tables.Resources, (table) => {
    table.string("Id").notNullable().unique().primary();
    table.string("Name").notNullable();
    table.string("Path").notNullable();
    table.string("BlurHash").notNullable();
    table.string("Author").references(`${Tables.Users}.Id`);
  });

  await createTableIfNotExists(Tables.UserAvatars, (table) => {
    table.string("UserId").references(`${Tables.Users}.Id`);
    table.string("ResourceId").references(`${Tables.Resources}.Id`);
  });

  await createTableIfNotExists(Tables.UserAddresses, (table) => {
    table.string("Id").notNullable().unique();
    table.string("UserId").notNullable().references(`${Tables.Users}.Id`);
    table.string("StreetName").notNullable();
    table.string("ProvinceName").notNullable();
    table.string("DistrictName").notNullable();
    table.string("WardName").notNullable();
    table.string("ContactPhone").notNullable();
  });

  await createTableIfNotExists(Tables.ProductStatus, (table) => {
    table.string("ProductId").references(`${Tables.Products}.Id`);
    table.enu("Status", [
      "selling",
      "pending",
      "accepted",
      "delivering",
      "sold",
    ]);
  });

  await createTableIfNotExists(Tables.ProductImage, (table) => {
    table.string("ProductId").references(`${Tables.Products}.Id`);
    table.string("ResourceId").references(`${Tables.Resources}.Id`);
  });

  await createTableIfNotExists(Tables.Order, (table) => {
    table.string("Id").primary().unique();
    table.string("UserId").references(`${Tables.Users}.Id`);

    table.string("ProvinceName").notNullable();
    table.string("DistrictName").notNullable();
    table.string("WardName").notNullable();
    table.string("AddressName").notNullable();
    table.string("PhoneNumber");
  });

  await createTableIfNotExists(Tables.ProductOrders, (table) => {
    table.string("OrderId").references(`${Tables.Order}.Id`);

    table.string("ProductId").references(`${Tables.Products}.Id`);
    table.string("ProductName").notNullable();
    table.double("ProductPrice").notNullable();
    table.integer("ProductCondition").notNullable();
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
