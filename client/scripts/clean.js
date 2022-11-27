const fs = require("fs");
const chalk = require("chalk");
const CLEAN_DIRECTORY = ["dist", ".parcel-cache"];

(async () => {
  console.log(`${chalk.gray("========== Clean up `client` ==========")}`);
  CLEAN_DIRECTORY.forEach((item) => {
    console.log(`Cleaning up ${chalk.yellow(item)} ...`);
    fs.rmSync(item, { force: true, recursive: true });
  });
  console.log(`${chalk.gray("=======================================")}`);
})()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
