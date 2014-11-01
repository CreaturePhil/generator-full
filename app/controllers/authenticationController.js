var passport = require('passport');

var User = require('../models/User');
var secrets = require('../../config/secrets');

var authenticationController = (function() {
  var controller = {};

  controller.signup = signup;
  controller.login = login;

  function signup() {
    var signup = {};

    signup.get = function(req, res, next) {
      if (req.user) return res.redirect('/');
      res.render('authentication/signup', {
        title: 'Create Account'
      });
    };

    signup.post = function(req, res, next) {
      req.assert('username', 'Only letters and numbers are allow in username.').regexMatch(/^[A-Za-z0-9]*$/);
      req.assert('username', 'Username cannot be more than 30 characters.').len(1, 30);
      req.assert('email', 'Email is not valid.').isEmail();
      req.assert('password', 'Password must be between 4 to 300 characters long.').len(4, 300);
      req.assert('confirmPassword', 'Passwords do not match.').equals(req.body.password);

      var errors = req.validationErrors();

      if (errors) {
        req.flash('errors', errors);
        return res.redirect('/signup');
      }

      var user = new User({
        uid: req.body.username.toLowerCase(),
          username: req.body.username,
          email: req.body.email,
          password: req.body.password
      });

      if (secrets.banUsernames.indexOf(user.uid) >= 0) {
        req.flash('errors', { msg: 'Your username cannot be called that.' })
          return res.redirect('signup');
      }

      User.findOne({ email: req.body.email }, function(err, existingUser) {
        if (existingUser) {
          req.flash('errors', { msg: 'Account with that email address already exists.' });
          return res.redirect('/signup');
        }
        User.findOne({ uid: req.body.username.toLowerCase() }, function(err, existingUser) {
          if (existingUser) {
            req.flash('errors', { msg: 'Account with that username already exists.' });
            return res.redirect('/signup');
          }
          user.save(function(err) {
            if (err) return next(err);
            req.logIn(user, function(err) {
              if (err) return next(err);
              req.flash('success', { msg: 'You have succesfully sign up.' });
              res.redirect('/');
            });
          });
        });
      });
    };
    
    return signup;
  }

  function login() {
    var login = {};

    login.get = function(req, res, next) {
      if (req.user) return res.redirect('/');
      res.render('authentication/login', {
        title: 'Login'
      });
    };

    login.post = function(req, res, next) {
      req.assert('username', 'Only letters and numbers are allow in username.').regexMatch(/^[A-Za-z0-9]*$/);
      req.assert('username', 'Username cannot be more than 30 characters.').len(1, 30);
      req.assert('password', 'Password cannot be blank').notEmpty();

      var errors = req.validationErrors();

      if (errors) {
        req.flash('errors', errors);
        return res.redirect('/login');
      }

      passport.authenticate('local', function(err, user, info) {
        if (err) return next(err);
        if (!user) {
          req.flash('errors', { msg: info.message });
          return res.redirect('/login');
        }
        req.logIn(user, function(err) {
          if (err) return next(err);
          req.flash('success', { msg: 'Success! You are logged in.' });
          res.redirect(req.session.returnTo || '/');
        });
      })(req, res, next);
    };

    return login;
  }


  return controller;
})();

module.exports = authenticationController;
