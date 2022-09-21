const Express = require("express");
const Router = Express.Router();
const bycrypt = require("bcryptjs");
const passport = require("passport");

// User Model
const User = require("../models/User");

//rendering register page
Router.get("/register", (req, res) => {
  res.render("register");
});

//rendering login page
Router.get("/login", (req, res) => {
  res.render("login");
});

//Registering User
Router.post("/register", (req, res) => {
  const { name, username, phone, email, password, verifypassword } = req.body;
  let errors = [];
  //validate required field
  if (!name || !username || !phone || !email || !password || !verifypassword) {
    errors.push({ msg: "Please fill in all fields" });
  }

  //check if password match
  if (password != verifypassword) {
    errors.push({ msg: "Password Do not match" });
  }

  //check password length
  if (password.length < 6) {
    errors.push({
      msg: "Password should be at least more than 6 Characters",
    });
  }
  //tracking erros
  if (errors.Length > 0) {
    res.render("register", {
      errors,
      name,
      username,
      phone,
      email,
      password,
      verifypassword,
    });
  } else {
    //if validation is passed
    User.findOne({ email: email }).then((user) => {
      if (user) {
        //user exist ? re-render : carry on
        errors.push({ msg: "Email is already Registered" });
        res.render("register", {
          errors,
          name,
          username,
          phone,
          email,
          password,
          verifypassword,
        });
      } else {
        const newUser = new User({
          name,
          username,
          phone,
          email,
          password,
        });
        //hashed req.password
        bycrypt.genSalt(10, (err, salt) => {
          bycrypt.hash(newUser.password, salt, (err, hash) => {
            //throw error if any error
            if (err) throw err;
            //Setting password to hashed password
            newUser.password = hash;
            //saving user
            newUser
              .save()
              .then((user) => {
                req.flash(
                  "success_msg",
                  "You are now registered and can log in"
                );
                res.redirect("/users/login");
              })
              .catch((err) => console.log(err));
          });
        });
      }
    });
  }
});

//Login Handnler
Router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true,
  })(req, res, next);
});

//LOGOUT USER
Router.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/users/login");
  });
  req.flash("success_msg", "Your are now logged out");
});

module.exports = Router;
