'use strict';

// npm
const debug = require('debug')('authDeity:deity-router');
const Router = require('express').Router;
const jsonParser = require('body-parser').json();

// app
const parseBearerAuth = require('../lib/parse-bearer-auth');
const deityController = require('../controller/deity-controller');

// module
const deityRouter = module.exports = new Router();

deityRouter.post('/deity', parseBearerAuth, jsonParser, function(req, res, next){
  debug('post-deity-router');
  req.body.userId = req.userId; // userId for authentication?
  deityController.createDeity(req.body)
  .then(deity => res.json(deity))
  .catch(next);
});

deityRouter.get('/deity/:id', parseBearerAuth, jsonParser, function(req, res, next){
  debug('get-deity-router');
  req.body.userId = req.userId;
  deityController.fetchDeity(req.params.id)
  .then(deity => res.json(deity))
  .catch(next);
});

deityRouter.put('/deity/:id', parseBearerAuth, jsonParser, function(req, res, next){
  debug('put-deity-router');
  req.body.userId = req.userId;
  deityController.updateDeity(req.params.id, req.body)
  .then(deity => res.json(deity))
  .catch(next);
});

deityRouter.delete('/deity/:id', parseBearerAuth, jsonParser, function(req, res, next){
  debug('delete-deity-route');
  req.body.userId = req.userId;
  deityController.deleteDeity(req.params.id)
  .then(deity => res.status(204).json(deity))
  .catch(next);
});
