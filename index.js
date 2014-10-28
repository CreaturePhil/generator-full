var express = require('express');
var morgan = require('morgan');

var router = require('./router');

var app = express();

app.use(morgan('dev'));

router(app);

module.exports = app;
