const User = require("../models/user");

// =====================
// RENDER SIGNUP FORM
// =====================
module.exports.renderSignupForm = (req, res) => {
  // Just rendering the signup page
  res.render("users/signup.ejs");
};

// =====================
// HANDLE SIGNUP LOGIC
// =====================
module.exports.signup = async (req, res, next) => {
  try {
    // destructuring user data from form
    let { username, email, password } = req.body.user;

    // creating a new user instance (password NOT included)
    const newUser = new User({ email, username });

    // passport-local-mongoose method
    // this hashes the password and saves user
    const registeredUser = await User.register(newUser, password);

    // automatically log in user after signup
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }

      // flash success message
      req.flash("success", "Welcome to WanderLust");

      // redirect after successful signup
      res.redirect("/listings");
    });
  } catch (e) {
    // handles duplicate username, validation errors, etc.
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

// =====================
// RENDER LOGIN FORM
// =====================
module.exports.renderLoginForm = (req, res) => {
  // Just rendering the login page
  res.render("users/login.ejs");
};

// =====================
// HANDLE LOGIN SUCCESS
// =====================
module.exports.login = async (req, res) => {
  // passport already authenticated user before this runs

  req.flash("success", "Welcome back!");

  // redirect to the page user wanted before login
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

// =====================
// HANDLE LOGOUT
// =====================
module.exports.logout = (req, res, next) => {
  // passport logout method
  req.logout((err) => {
    if (err) {
      return next(err);
    }

    req.flash("success", "You're logged out");
    res.redirect("/listings");
  });
};
