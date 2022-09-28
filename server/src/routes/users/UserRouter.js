"use strict";
const express = require("express");
const { createUser } = require("./UserController");
// eslint-disable-next-line
const router = express.Router();

router.post(`/`, createUser);

module.exports = router;
