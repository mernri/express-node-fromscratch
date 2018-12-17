const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");

// Bring in User Model
const User = require("../models/user");

// GET - Register form Route (register part 1)
router.get("/register", (req, res, next) => {
  res.render("register");
});

// POST - Registeration completed (register part 2) // PAS MA SYNTAXE PREFEREE
router.post("/register", (req, res, next) => {
  const { name, email, username, password } = req.body;
  let newUser = new User({ name, email, username, password });
  // on crypte le password
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(newUser.password, salt, function(err, hash) {
      if(err){
        console.log("error")
      }
      newUser.password = hash;
      // une fois le password crypté, on enregistre le user
      newUser.save(function(err) {
        if(err){
          console.log("error");
          return;
        } else {
          res.redirect('/users/login')
        }
      })
    })
  })
});

// GET - LOGIN form
router.get("/login", (req, res) => {
  res.render("login");
});

// POST - LOGIN process
router.post('/login', function(req, res, next){
  passport.authenticate('local', {
    successRedirect:'/',
    failureRedirect:'/users/login',
    failureFlash: true
  })(req, res, next);
});

module.exports = router;