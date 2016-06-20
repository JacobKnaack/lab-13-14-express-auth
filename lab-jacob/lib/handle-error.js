'use strict';

const debug = require('debug')('authdeity:handle-errors');
const httpErrors = require('http-errors');

module.exports = function(err, req, res, next){
  debug('handleErrors');
  debug(err.message);
  if (err.status && err.name){
    res.status(err.status).send(err.name);
    next();
    return;
  }

  err = httpErrors(500, err.message);
  res.status(err.status).send(err.name);
};
