const User = require("../models/user");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
require("dotenv").config();

exports.signup = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array(),
    });
  }

  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        err: err.message,
      });
    }
    res.json({
      Name: user.firstname,
      Id: user._id,
    });
  });
};

exports.signin = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array(),
    });
  }

  //destructuring email and password from body
  const { email, password } = req.body;

  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "Email doesn't Exists",
      });
    }
    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: "Username/Password Doesn't match",
      });
    }
    //Generate Token
    const authToken = jwt.sign({ _id: user._id }, process.env.SECRET);

    //Put token in Cookie
    res.cookie("authToken", authToken, { expire: new Date() + 99999 });

    //send response
    const { _id, firstname, lastname, email, role } = user;

    var fullname = firstname + ' ' + lastname;

    return res.json({
      authToken,
      user: { _id, fullname, email, role },
    });
  });
};

exports.signout = (req, res) => {
  res.clearCookie("authToken");
  res.json({
    message: "User Signed Out!!",
  });
};

//Protected Routes
exports.isSignedIn = expressJwt({
  secret: process.env.SECRET,
  userProperty: "auth",
});

//#region Custom Middlewares

exports.isAuthenticated = (req, res, next) => {
  let checker = req.profile && req.auth && req.profile._id == req.auth._id;
  if (checker == false) {
    return res.status(403).json({
      error: "ACCESS DENIED",
    });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (!req.profile.role == 1) {
    return res.status(403).json({
      error: "You are not Admin,Acess Denied",
    });
  }
  next();
};

//#endregion
