'use strict';

// npm
const debug = require('debug')('authDeity:deity-router');
const Router = require('express').Router;
const jsonParser = require('body-parser').json();

// app
const parseBearerAuth = require('../lib/parseBearAuth');
const deityController = require('../controller/deity-controller');

// module
const deityRouter = module.exports = new Router();

deityRouter.post('/deity', parseBearerAuth, jsonParser, function(req, res, next){
  debug('diety-router');
  req.body.userId = req.userId;
  deityController.createDeity(req.body)
  .then(deity => res.json(deity))
  .catch(next);
});
