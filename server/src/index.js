"use strict";
require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const ErrorHandler = require("./utils/ErrorHandler");

app.use(bodyParser.text());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan("dev"));

// app.use("/", (req, res, next) => {
//   res.json({
//     message: "Perfectly working.",
//   });
// });

app.use("/provinces", require("./routes/provinces/ProvincesRouter"));
app.use("/users", require("./routes/users/UserRouter"));
app.use("/auth", require("./routes/auth/AuthRouter"));

/**
 * Register error catcher level
 */
app.use(ErrorHandler);

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

// For testing
module.exports = app;
