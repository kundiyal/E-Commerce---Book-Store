var express = require("express");
var router = express.Router();
const { check, validationResult } = require("express-validator");
const { signout, signup, signin, isSignedIn } = require("../controllers/auth");

router.get("/signout", signout);

router.post(
  "/signup",
  [
    check("firstname")
      .isLength({ min: 3, max: 55 })
      .withMessage("First Name must be 3-55 characters"),
    check("email").isEmail().withMessage("Email Required"),
    check("password").notEmpty().withMessage("Password Required"),
  ],
  signup
);

router.post(
  "/signin",
  [
    check("email").isEmail().withMessage("Email Required"),
    check("password").notEmpty().withMessage("Password Required"),
  ],
  signin
);



module.exports = router;
