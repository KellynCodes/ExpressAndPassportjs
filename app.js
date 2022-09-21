const express = require("express");
const app = express();
const ExpressLayout = require("express-ejs-layouts");
const PORT = process.env.PORT || 5000;
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
//db_config
const db = require("./config/keys").MONGO_URI;
// connecting to mongo db database
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log(`MongoDb Connected`))
  .catch((err) => console.log(err));

//passport config
require("./config/passport")(passport);

//usings
app.use(ExpressLayout);
//setting view engine
app.set("view engine", "ejs");
//body parser
app.use(express.urlencoded({ extended: false }));

//Express Sessions MiddleWare
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//flash connection
app.use(flash());

//adding global viriables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

//getting routes
const userRoute = require("./routes/user");
const IndexRoute = require("./routes/index");
// const facebookLogin = require("./routes/loginWithFacebook");

//using each routes
app.use("/users", userRoute);
app.use("/", IndexRoute);
// app.use("/users", facebookLogin);
//setting browser port
app.listen(PORT, console.log(`App running on port ${PORT}`));
