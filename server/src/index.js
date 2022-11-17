"use strict";
const app = require("./app");
const chalk = require("chalk");
const cors = require("cors");
app.use(cors());

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
