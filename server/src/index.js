"use strict";
const app = require("./app");
const chalk = require("chalk");

/**
 * Listen function
 */
(async () => {
  const PORT = await require("./../scripts/check-port")(
    process.env.PORT || 3000,
  );

  app.listen(PORT, () => {
    console.log(chalk.bgGreen(`Listening to ${PORT}`));
    console.log(`🛬🛬🛬🛬🛬🛬`);
  });
})();
