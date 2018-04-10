var express = require("express");
var basicAuth = require("express-basic-auth");
var routes = require("./routes");
var cookie_parser = require("cookie-parser");
var body_parser = require("body-parser");
var path = require("path");
var User = require("dijible-lib/User");
var express_session = require("express-session");
var passport = require("passport");
var Passport_Strategy = require("passport-local").Strategy;
var logger = require("dijible-lib/util/logger").get_logger("app");

var app = express();

app.use(express_session({
  secret: "pitch strong luck tales"
}));

passport.use(new Passport_Strategy(
  function(username, password, callback) {
  logger.info("Using passport strategy");

    User.get_user_by_credentials(username, password)
    .then(function(user) {
      if(user === null) {
        return callback(null);
      }
      else {
        return callback(null, user);
      }
    });
  }));

passport.serializeUser(function(user, callback) {
  callback(null, user._id);
});

passport.deserializeUser(function(user_id, callback) {
  User.get_user_by_id(user_id)
  .then(function(user) {
    callback(null, user);
  });
});

app.use(cookie_parser());
app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: false }));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, "public")));
app.use("/external/bower_components",
  express.static(path.join(__dirname, "bower_components")));
app.use("/external/bootswatch",
  express.static(path.join(__dirname, "node_modules", "bootswatch", "dist")));
app.use("/external/select2",
  express.static(path.join(__dirname, "node_modules", "select2", "dist")));
app.use("/external/jquery",
  express.static(path.join(__dirname, "node_modules", "jquery", "dist")));
app.use("/external/moment",
  express.static(path.join(__dirname, "node_modules", "moment", "min")));
app.use("/external/bootstrap",
  express.static(path.join(__dirname, "node_modules", "bootstrap", "dist")));
app.use("/external/flatpickr",
  express.static(path.join(__dirname, "node_modules", "flatpickr", "dist")));

  
app.post("/login", 
  passport.authenticate("local", { failureRedirect: "/" }),
  function(req, res) {
    res.redirect("/");
});

app.get("/logout",
  function(req, res){
    req.logout();
    res.redirect('/');
});

app.use("/", routes);

app.use(function(req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

module.exports = app;
