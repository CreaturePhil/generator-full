var express = require('express');
var morgan = require('morgan');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')({ session: session });
var csrf = require('lusca').csrf();
var compress = require('compression');
var passport = require('passport');
var flash = require('express-flash');
var expressValidator = require('express-validator');
var moment = require('moment');

var path = require('path');

var router = require('./router');
var secrets = require('./config/secrets');

var app = express();
    
/**
 * Connect to MongoDB.
 */

mongoose.connect(secrets.db);
mongoose.connection.on('error', function() {
  console.error('MongoDB Connection Error. Make sure MongoDB is running.');
});

/**
 * App configuration.
 */

// view engine setup
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'jade');

app.use(compress());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: secrets.session,
  store: new MongoStore({
    url: secrets.db,
    auto_reconnect: true
  })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(expressValidator({
  customValidators: {
    regexMatch: function(arg, regex) {
      return arg.match(regex);
    }
  }
}));

app.use(function(req, res, next) {
  // CSRF protection.
  csrf(req, res, next);
});

app.use(function(req, res, next) {
  // Make user object available in templates.
  res.locals.user = req.user;

  // Make moment object available in templates.
  res.locals.moment = moment;
  next();
});

// static cache for one week
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 604800000 }));

// routes setup
router(app);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Page Not Found');
  err.status = 404;
  next(err);
});

/**
 * Error Handlers
 */

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  // Don't minify html
  app.locals.pretty = true;

  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      title: 'Page not found',
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    title: 'Page not found',
    message: err.message,
    error: {}
  });
});

module.exports = app;
