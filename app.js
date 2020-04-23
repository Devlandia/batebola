const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const app     = require('./app/events')
const server  = app.server;

const indexRouter = require('./routes/index');
const arenaRouter = require('./routes/arena');
// const usersRouter = require('./routes/users');

app.use(logger('dev'));
// parse application/json
app.use(express.json());
// parse application/x-www-form-urlencoded
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', indexRouter);
app.use('/arena', arenaRouter);
// app.use('/users', usersRouter);

// Serve static files
app.use('/assets', express.static('app/assets'))

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  console.log('\n\n');
  console.log('#############################################################');
  console.log(err.message);
  console.log('#############################################################');

  // render the error page
  res.status(err.status || 500);

  res.send('{"error":"internal server error"}');
});

module.exports = app;
module.exports.server = server;
