"use strict";
const fs = require("fs");

/**
 * Get static directory path name from `process.env`
 * @return {string} a static directory path name from process environment
 */
function getStaticDirectory() {
  if (process.env.STATIC_SERVE_DIRECTORY_NAME === undefined) {
    throw new Error(`STATIC_SERVE_DIRECTORY_NAME not found in .env`);
  }

  return process.env.STATIC_SERVE_DIRECTORY_NAME.trim();
}

/**
 * check whether the static serve directory is existed or not
 * @return {boolean} true whether existing, false otherwise.
 */
function hasStaticDirectory() {
  return fs.existsSync(getStaticDirectory());
}

module.exports = {
  getStaticDirectory,
  hasStaticDirectory,
};
