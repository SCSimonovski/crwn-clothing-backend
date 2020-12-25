require("./db/mongoose.js");
const express = require("express");
const cors = require("cors");

const userRouter = require("./routers/users-router");
const sectionRouter = require("./routers/sections-router");
const itemRouter = require("./routers/items-router");
const stripeRouter = require("./routers/stripe-router");
const errorHandler = require("./error/error-handler");

const app = express();
const port = process.env.PORT;

app.use(express.json());

if (process.env.NODE_ENV === "development") {
  const morgan = require("morgan");
  app.use(morgan("dev"));
}

app.use(cors());

app.use(userRouter);
app.use(sectionRouter);
app.use(itemRouter);
app.use(stripeRouter);

app.use(errorHandler);

app.use((req, res) => {
  res.status(404).send({
    error: "The path doesn't exist",
  });
});

app.listen(port, () => {
  console.log("Server is up on port: ", port);
});
