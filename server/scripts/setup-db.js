const chalk = require("chalk");
const Tables = require("../driver/Table");
const driver = require("./../driver/KnexDriver");

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
}

(async () => {
  console.log(chalk.magenta(`[-] Database setting up...`));

  await setupDatabase();

  // require("./fetch-provinces");
})()
  .then(process.exit)
  .catch(console.error);
