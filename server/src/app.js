"use strict";
require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const ErrorHandler = require("./utils/ErrorHandler");
const cors = require("cors");

app.use(cors());
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
app.use("/products", require("./routes/products/ProductRouter"));
app.use("/resources", require("./routes/resources/ResourceRouter"));

/**
 * Register error catcher level
 */
app.use(ErrorHandler);

module.exports = app;
