"use strict";
const chalk = require("chalk");

/**
 * Print trace stack out of the console as error level
 *
 * @param {Error} error an error to print out trace
 */
function printTrace(error) {
  console.error(chalk.redBright(error.stack));
}

module.exports = {
  printTrace,
};
