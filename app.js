var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var session = require("express-session");
var MongoStore = require("connect-mongo")(session);
var bcrypt = require("bcrypt");
var hbs = require("hbs");
const bodyParser = require("body-parser");
var session = require("express-session");
var moment = require("moment");

require("dotenv").config();

var indexRouter = require("./routes/index");
var teamsRouter = require("./routes/teams");
var authRouter = require("./routes/auth");
var profileRouter = require("./routes/profile");
var feedRouter = require("./routes/feed");
var postActivityRouter = require("./routes/postActivity.js");
var userRouter = require("./routes/users.js");

var app = express();

//connect to mongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(connection => {
    console.log("successfully connected");
  })
  .catch(err => {
    console.log(err);
  });

//setup the session
app.use(
  session({
    secret: "basic-auth-secret",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 24 * 60 * 60 * 10 },
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 24 * 60 * 60 * 10 // 1 day
    })
  })
);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
hbs.registerPartials(__dirname + "/views/partials");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/teams", teamsRouter);
app.use("/auth", authRouter);
app.use("/profile", profileRouter); // this for logged in user
app.use("/user", userRouter); // this will be for other users
app.use("/feed", feedRouter);
app.use("/postActivity", postActivityRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
