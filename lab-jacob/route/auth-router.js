'use strict';

// npm
const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const debug = require('debug')('authDeity:auth-router');
const parseBasicAuth = require('../lib/parse-basic-auth');

// other local apps
const authController = require('../controller/auth-controller');

// module constants
const authRouter = module.exports = new Router();

authRouter.post('/signup', jsonParser, function(req, res, next) {
  debug('authRouter-signup');
  authController.signup(req.body)
  .then(token => res.send(token))
  .catch(next);
});

authRouter.get('/signin', parseBasicAuth, function(req, res, next) {
  debug('authRouter-signin');
  authController.signin(req.auth)
  .then(token => res.send(token))
  .catch(next);
});
