const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const userRouter = require("./routes/userRouter");

const userName = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;
const PORT = process.env.PORT;

const url = `mongodb+srv://${userName}:${password}@cluster0.xuy6aol.mongodb.net/${dbName}?retryWrites=true&w=majority`;
// const url = `mongodb+srv://${userName}:${password}@cluster0.aethqem.mongodb.net/${dbName}?retryWrites=true&w=majority`;

const app = express();
app.use(bodyparser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});
// Desired Paths //////////////////////////////////////////

app.use("/api/users", userRouter);

// Desired Path ends///////////////////////////////////////

app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }
  if (res.headerSent) {
    return next(error);
  }
  console.log("General error ==========\n" + error + "\n\n\n");
  res.status(error.code || 500);

  res.json({ message: error.message || "An unknown error occured" });
});

mongoose
  .connect(url)
  .then(() => {
    app.listen(PORT, () => {
      console.log("app is listening on PORT : ", PORT);
    });
  })
  .catch((error) => {
    console.log("mongoose error : ", error);
  });
