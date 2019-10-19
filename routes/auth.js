const express = require("express");
const router = express.Router();

// User model
const User = require("../models/User");

// BCrypt to encrypt passwords
const bcrypt = require("bcrypt");
const saltRounds = 10;

//Psw strenght
const zxcvbn = require("zxcvbn");
zxcvbn("Tr0ub4dour&3");

/* GET signup page. */
router.get("/signup", function(req, res, next) {
  res.render("signup", { sport: "Express" });
});

const bcryptSalt = 10;

router.post("/signup", (req, res, next) => {
  // object deconstructing to simplify the const declaration, in case you have many objects to declare

  const { username, password } = req.body;
  zxcvbn(password, (user_inputs = []));

  // object deconstructing replace the 2 lines below
  //   const username = req.body.username;
  //   const password = req.body.password;

  //validate to check if username and psw are entered correctly
  if (username === "" || password === "") {
    res.render("signup", {
      errorMessage: "Enter username and a password to create an account"
    });
    return;
  }

  //check if username already exist

  User.findOne({ username: username }).then(user => {
    if (user !== null) {
      res.render("signup", {
        errorMessage: "The username already exists!"
      });
      return;
    }

    // encrypt psw and create database
    bcrypt
      .hash(password, bcryptSalt)
      .then(hashedPassword => {
        return User.create({
          username,
          password: hashedPassword
        });
      })
      .then(() => {
        res.redirect("/");
      })
      .catch(error => {
        console.log(error);
      });
  });
});

/* GET Login page. */
router.get("/login", function(req, res, next) {
  res.render("login", { sport: "Express" });
});

router.post("/login", (req, res, next) => {
  const { username, password } = req.body;

  if (username === "" || password === "") {
    res.render("login", {
      errorMessage: "Enter username and password to login."
    });
    return;
  }

  User.findOne({ username: username })
    .then(user => {
      debugger;
      if (!user) {
        res.render("login", {
          errorMessage: "The username doesn't exist."
        });
        return;
      }
      if (bcrypt.compareSync(password, user.password)) {
        // Save the login in the session!
        req.session.user = user;
        res.redirect("/activities");
      } else {
        res.render("login", {
          errorMessage: "Incorrect password"
        });
      }
    })
    .catch(error => {
      next(error);
    });
});

/* GET Signout page. */

router.get("/logout", (req, res, next) => {
  req.session
    .destroy(err => {
      // cannot access session here
      res.redirect("/");
    })
    .catch(error => {
      next(error);
    });
});

module.exports = router;
