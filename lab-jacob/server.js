'use strict';

// npm modules
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const debug = require('debug')('authDeity: server');
const httpErrors = require('http-errors');

// app modules
const authRouter = require('route/auth-router');
const handleError = require('lib/handle-error');

//  server constants
const app = express();
const port = process.env.PORT || 3030;
const mongoURI = process.env.MONGO_URI || 'mongobd://localhost/authDeityDev';

// mongo setup
mongoose.connect(mongoURI);

// middleware
app.use(morgan('dev'));

//set up routers
app.use(authRouter);

app.all('/', function(req, res){
  console.log(req.userId);
  res.send('success');
});

app.use('*', function( req, res, next){
  debug('404 route');
  next(httpErrors(404, 'not a route'));
});

app.use(handleError);

// setup server
const server = module.exports = app.listen(port, function(){
  debug('server up!!', port);
});

server.isRunning = true;