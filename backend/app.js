const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const userRouter = require("./routes/users");
const cardsRouter = require("./routes/cards");
var cors = require("cors");

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

// need to delete
// app.use((req, res, next) => {
//   req.user = {
//     _id: "61b9dc817e08673ab8484c17", // paste the _id of the test user created in the previous step
//   };

//   next();
// });

app.use("/", userRouter);
app.use("/", cardsRouter);

app.get("*", (req, res) => {
  res.status(404).send({ message: "Requested resource not found" });
});

app.listen(PORT, () => {
  console.log(`Listen on PORT ${PORT}`);
});
