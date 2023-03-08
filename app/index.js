// Modules requires
const express = require("express");
const helmet = require("helmet");
const router = require("./api/router");
const cors = require("cors");
const logger = require("morgan");
const path = require("path");
const { upload } = require("./middleware/multer");
const uploads = require("multer");
const { logger: logs } = require("./config/logger");

const { ServerError } = require("./utils/cli");
const { required } = require("joi");

//Application Defination
const app = express();

//Middlewares
app.use(logger("dev"));
app.use(helmet());
app.use(cors());

app.use(
  express.json({
    limit: "5mb",
  })
);
app.use("/image/filter", upload().any());
app.use('/custom-label',uploads().any());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use("/uploads", express.static("uploads"));

app.get("/", function (req, res) {
  res.send("Up and Running - " + new Date());
});

//Routes
app.use("/", router);

// Not Found handler
app.use("*", (req, res, next) => {
  next(new ServerError("API Not found", 404));
});

app.use((error, req, res, next) => {
  if (!error.status) {
    logs.error(`the pathe error in ${req.path}, server error: ${error}`);
    return res.status(500).json({
      errors: ["server error"],
      status: 500,
    });
  }
  logs.error(
    `the pathe error in ${req.path},  Custom Server Error > ${error.message}`
  );
  let errors = {};
  if (typeof error.message === "string" || error.message instanceof String) {
    // it's a string error
    errors = error.message;
  } else {
    // it's a validation error object
    error = {
      ...error.message,
    };
  }

  return res.status(error.status).json({
    errors,
    status: error.status,
  });
});

module.exports = app;
