"use strict";
const app = require("./app");

/**
 * Listen function
 */
(async () => {
  const PORT = await require("./../scripts/check-port")(
    process.env.PORT || 3000,
  );

  app.listen(PORT, () => {
    console.log(`Listening to ${PORT}`);
  });
})();
