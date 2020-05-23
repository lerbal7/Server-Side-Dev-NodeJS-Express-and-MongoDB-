var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require('./routes/dishRouter');
var promotionRouter = require('./routes/promotionRouter');
var leaderRouter = require('./routes/leaderRouter');

const mongoose = require('mongoose');
const Dishes = require('./models/dishes');

const url = 'mongodb://localhost:27017/conFusion';
const connect = mongoose.connect(url);

connect.then((db) => {
  console.log('Connected correctly to the server');
}, (err) => { console.log(err)}); // Establish connection to server

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// first middleware
function auth(req, res, next) {
  console.log(req.headers); // What's coming from client side

  var authHeader = req.headers.authorization; // If the auth header is not there,
  // there is no authentication

  if (!authHeader) {
    var err = new Error('You are not authorized!');
    res.setHeader('WWW-Authenticate', 'Basic'); // WWW-Authenticate is a header need when returning a 401 Error code
    err.status = 401; // Code for unauthorized access
    return next(err);
  }

  // Typical Auth Header --> Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ==
  // We know that when the user enters his credentials, they are sent
  // encoded in base64 (in this case). This encoding is decoded by the server
  // to verify the correct authentication. The encoding contains the word
  // Basic, a space and a string which contains the username and the password
  // separated by a semicolon. So first we need to split that whole string 
  // taking into account the space and then we need to take the second string
  // and split it again but this time taking
  // into account the semicolon. Therefore we will have two elements inside that
  // second element, the username
  // and the password.
  var auth = new Buffer(authHeader.split(' ')[1], 'base64')
  .toString().split(':');

  var username = auth[0];
  var password = auth[1];

  // Suppose these are the credentials
  if (username === 'admin' && password === 'password') {
    next(); // allows this middleware to pass to the next one
  }
}

app.use(auth); // Before client can access any of the resources, authentication is needed

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/dishes', dishRouter);
app.use('/promotions', promotionRouter);
app.use('/leaders', leaderRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
