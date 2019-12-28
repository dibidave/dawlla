var express = require("express");
var routes = require("./routes");
var cookie_parser = require("cookie-parser");
var body_parser = require("body-parser");
var path = require("path");
var User = require("dijible-lib/User");
var express_session = require("express-session");
var passport = require("passport");
var Passport_Strategy = require("passport-local").Strategy;
var logger = require("dijible-lib/util/logger").get_logger("app");
var uuid = require('uuid/v1');

var app = express();

app.use(function(req, res, next) {
  let new_id = uuid();
  logger.trace("The endpoint " + req.url + " was called. Setting id " + new_id);
  req["id"] = new_id;
  next();
});

app.use(express_session({
  secret: "pitch strong luck tales",
  saveUninitialized: true,
  resave: true
}));

passport.use(new Passport_Strategy(
  function(username, password, callback) {
    logger.trace("Using passport strategy");
    
    User.get_user_by_credentials(username, password)
    .then(function(user) {
      logger.trace("Got user:");
      logger.trace(user);
      if(user === null) {
        return callback(null);
      }
      else {
        return callback(null, user);
      }
    });
  })
);

passport.serializeUser(function(user, callback) {

  logger.trace("Serializing user:");
  logger.trace(user);

  callback(null, user._id);
});

passport.deserializeUser(function(user_id, callback) {
  logger.trace("Deserializing user:");
  logger.trace(user_id);

  User.get_user_by_id(user_id)
  .then(function(user) {
    logger.trace("Deserialized user:");
    logger.trace(user);
    callback(null, user);
  });
});

app.use(function(req, res, next) {
  logger.trace({"message": "Loaded session information", "session": req.session, "id": req.id});
  next();
});

app.use(cookie_parser());
app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: false }));

app.use(function(req, res, next) {
  logger.trace({"id": req.id, "cookies": req.cookies});
  next();
});

app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {
  logger.trace({"id": req.id, "passport": req.session.passport});
  next();
});

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
  passport.authenticate("local", { failureRedirect: "/" }), function(req, res) {
    logger.trace("Authentication successful");
    logger.trace({"id": req.id, "user": req.user, "session": req.session});
    return res.json({
      session: req.session
    });
  }
);

app.get("/logout",
  function(req, res){
    req.logout();
    res.redirect('/');
});

app.use("/", routes);

app.use(function(req, res, next) {
  logger.trace("Attempted to access invalid URL, '" + req.url + "'");
  res.status(404).send("Not Found");
});

module.exports = app;
