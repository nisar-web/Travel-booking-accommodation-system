const express = require("express");
const router = express.Router();
const passport = require("passport");

const userController = require("../controller/userController");
const { saveRedirectUrl } = require("../loginmiddleware");

// SIGNUP ROUTES
router.get("/signup", userController.renderSignupForm);
router.post("/signup", userController.signup);

// LOGIN ROUTES
router.get("/login", userController.renderLoginForm);
router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userController.login
);

// LOGOUT ROUTE
router.get("/logout", userController.logout);

module.exports = router;
