const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieparser = require("cookie-parser");
require("dotenv").config({ path: ".env" });
const path = require("path");
const app = express();

app.use(cors());
app.use(cookieparser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));
app.use("/storage", express.static(path.join(__dirname, "storage")));

const Routes = require("./route/index.route");
app.use(Routes);

mongoose.set("strictQuery", true);
mongoose.connect(process.env.MONGO_URL);
const db = mongoose.connection;

db.on("error", (error) => {
  console.log(error);
});
db.once("open", () => {
  console.log("database connected");
});

app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});

module.exports = app;
