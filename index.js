require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const routes = require("./src/routes/routes");
const bodyParser = require("body-parser");
const { ValidationError } = require("express-validation");

const app = express();
//body parser to retrieve data from form body
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use("/api/v1", routes);
mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use(function (err, req, res, next) {
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json(err);
  }
  return res.status(500).json(err);
});
app.listen(3000, () => {
  console.log(`Server Started at ${3000}`);
});
