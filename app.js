var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const conn = require('./modules/database');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// Middleware setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Apply authentication middleware to protect all routes
var authenticate = require('./middlewares/auth.middleware.js'); // Import the authentication middleware

app.get('/', function(req, res, next) {
  res.render('index', { title: 'Login' });
});

app.post('/login', authenticate, function(req, res, next) {
  res.redirect('/dashboard');
});

// app.use(authenticate);

// Routes setup

app.use('/', indexRouter);
app.use('/users', usersRouter);

// Error handling middleware
app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
    // Handle specific error messages
    if (err.message === "Username and Password are required") {
      // Redirect to the "/" route
      return res.redirect('/');
    }
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
