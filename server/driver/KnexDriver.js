const knex = require("knex");
const getEnvironmentVariable = (path) => {
  if (!process.env[path]) {
    throw Error(
      `process.env.${path} are undefined, ensure load .env or set it before run`
    );
  }
  return process.env[path];
};

/**
 *  @type {knex.Knex}
 *  @returns
 */
module.exports = knex({
  client: "mysql2",
  connection: {
    host: getEnvironmentVariable("DATABASE_HOST"),
    port: getEnvironmentVariable("DATABASE_PORT"),
    user: getEnvironmentVariable("DATABASE_USERNAME"),
    password: getEnvironmentVariable("DATABASE_PASSWORD"),
    database: getEnvironmentVariable("DATABASE_NAME"),
  },
  debug: true,
  // asyncStackTraces: true,
});
