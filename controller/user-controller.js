const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const HttpError = require("../Http-error");
const User = require("../model/user");

const DUMMY_USER = [
  {
    name: "pankaj",
    email: "Hello@gm.com",
    password: "123456",
  },
];

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      // class HttpError extends Error {
      //     constructor(message, errorCode){
      //     super(message);
      //     this.code = errorCode;
      //     }
      // }
      // module.exports = HttpError;

      new HttpError("Invalid input passes, please check your data", 422)
    );
  }

  const { name, email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (e) {
    return next(new HttpError("Signup failed, Please try again later", 500));
  }
  if (existingUser) {
    return next(
      new HttpError("User already exists, Please login instead.", 422)
    );
  }
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (error) {
    console.log(error);
    return next(
      new HttpError("Could not create user, Please try again later", 500)
    );
  }
  const createdUser = new User({
    name,
    email,
    password: hashedPassword,
  });
  try {
    await createdUser.save();
  } catch (error) {
    return next(new HttpError("Signup failed, Place try again", 500));
  }
  let accessToken, refreshToken;
  try {
    accessToken = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      process.env.JWT_KEY,
      { expiresIn: "15m" }
    );

    refreshToken = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      process.env.JWT_KEY,
      { expiresIn: "7d" }
    );
  } catch (error) {
    return next(new HttpError("Signup failed, Place try again", 500));
  }

  res.status(201).json({
    userId: createdUser.id,
    email: createdUser.email,
    token: { accessToken, refreshToken },
  });
};

exports.signup = signup;
