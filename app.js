var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var mongoose = require("mongoose");

var Game = require("./models/Game");

// const game = new Game({
//   currentState: [cccc
//     [1, 1, 1],
//     [5, 5, 5],
//   ],
// });

// game.save((error, document) => {
//   if (error) console.log(error);
//   console.log(document);
// });

const connectionString =
  "mongodb+srv://<username>:<password>@cluster0.mwavc.mongodb.net/connect4-api?retryWrites=true&w=majority";

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.once("open", (_) => {
  console.log("Database connected:", connectionString);
});

db.on("error", (err) => {
  console.error("connection error:", err);
});

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
