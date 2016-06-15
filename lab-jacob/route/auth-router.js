'use strict';

// npm
const Router = require('express').Router;
const jsonParser = require('body-aprser').json();
const debug = require('debug')('authDeity:auth-router');

// other local apps
const authController = require('../controller/auth-controller');

// module constants
const authRouter = module.exports = new Router();

authRouter.post('/signup', jsonParser, function(req, res, next) {
  debug('authRouterSignup');
  authController.signup(req.body)
  .then(token => res.send(token))
  .catch(next);
});

authRouter.get('/signin', function(req, res, next) {
  authController.signin(req.auth)
  .then(token => res.send(token))
  .catch(next);
});
