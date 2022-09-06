const chalk = require("chalk");
/**
 *
 * @param {*} port an available port
 * @returns an available port
 */
module.exports = async (port) => {
  if (!port) {
    throw Error("Port value cannot be undefined");
  }

  return new Promise((resolve, rejected) => {
    require("detect-port")(port, (_err, _port) => {
      // Reject if it malfunction
      if (_err) {
        return rejected(_err);
      }

      // Otherwise, check the port whether is busy or not
      if (parseInt(_port) !== parseInt(port)) {
        console.warn(
          chalk.yellow(`<~> Port ${port} is busy, using ${_port}...`)
        );
      }

      return resolve(_port);
    });
  });
};
