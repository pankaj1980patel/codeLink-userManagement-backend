const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const userController = require("../controller/user-controller");

// console.log("userController === ", userController);
router.post(
  "/signup",
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  userController.signup
);

module.exports = router;
