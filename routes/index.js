const Express = require("express");
const Router = Express.Router();
const { ensureAuthenticated } = require("../config/auth");

//index/welcome page
Router.get("/", (req, res) => {
  res.render("welcome");
});

// LoggedIn user dashboard page
//RENDERING DASHBOARD PAGE
Router.get("/dashboard", ensureAuthenticated, (req, res) =>
  res.render("dashboard", {
    username: req.user.username,
  })
);

module.exports = Router;
