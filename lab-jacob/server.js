'use strict';

// npm modules
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const debug = require('debug')('authDeity: server');
const httpErrors = require('http-errors');

// app modules
const authRouter = require('./route/auth-router');
const deityRouter = require('./route/deity-router');
const handleError = require('./lib/handle-error');
const parseBearerAuth = require('./lib/parse-bearer-auth');

//  server constants
const app = express();
const port = process.env.PORT || 3000;
const mongoURI = process.env.MONGO_URI || 'mongobd://localhost/authDeityDev';

// connect to mongo
mongoose.connect(mongoURI);

// middleware
app.use(morgan('dev'));

//set up routes
app.all('/', parseBearerAuth, function(req, res){
  console.log('req.userId:', req.userId);
  res.send('user authorized');
});

app.use('/api', deityRouter);
app.use('/api', authRouter);

app.all('*', function( req, res, next){
  debug('400/404 Error route');
  if(req._readableState.length == 0) {
    return next(httpErrors(400, 'no request given'));
  }
  next(httpErrors(404, 'not a route'));
});

app.use(handleError);

// setup server
const server = module.exports = app.listen(port, function(){
  debug(`server up!! ${port}`);
});

server.isRunning = true;
