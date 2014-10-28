var express = require('express');
var morgan = require('morgan');

var path = require('path');

var router = require('./router');

var app = express();

/**
 * App configuration.
 */

// view engine setup
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'jade');

app.use(morgan('dev'));

// routes setup
router(app);

module.exports = app;
