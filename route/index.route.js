const express = require("express");
const route = express.Router();

const helpRoute = require("./help.route");
route.use("/help", helpRoute);

module.exports = route;
