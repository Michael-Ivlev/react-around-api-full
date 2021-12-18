const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const cors = require("cors");
const { errors } = require("celebrate");
const userRouter = require("./routes/users");
const cardsRouter = require("./routes/cards");
const { requestLogger, errorLogger } = require("./middlewares/logger");

const { PORT = 3000 } = process.env;
const app = express();

app.use(cors());
app.options("*", cors());

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose
  .connect("mongodb://localhost:27017/aroundb")
  .then(() => console.log("Database connected!"))
  .catch((err) => console.log(err));

// request logger
app.use(requestLogger);

app.use("/", userRouter);
app.use("/", cardsRouter);

app.get("*", (req, res) => {
  res.status(404).send({ message: "Requested resource not found" });
});

// error logger
app.use(errorLogger);

// celebrate error middleware
app.use(errors());

// central error middleware
app.use((err, req, res, next) => {
  // if an error has no status, display 500
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    // check the status and display a message based on it
    message: statusCode === 500 ? "An error occurred on the server" : message,
  });
});

app.listen(PORT, () => {
  console.log(`Listen on PORT ${PORT}`);
});
