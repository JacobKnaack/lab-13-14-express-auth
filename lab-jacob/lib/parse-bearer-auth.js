'use strict';

// npm
const debug = require('debug')('authDeity:parse-bearer-auth');
const httpErrors = require('http-errors');
const jwt = require('jsonwebtoken');

// app
const User = require('../model/user');

module.exports = function(req, res, next){
  debug('parse-bearer-auth');
  if(!req.headers.authorization)
    return next(httpErrors(401, 'no authorization header'));

  const token = req.headers.authorization.split(' ')[1];
  jwt.verify(token, process.env.APP_SECRET, function(err, unHash){
    if(err) return next(httpErrors(401, err.message));
    User.findOne({findHash: unHash.token})
    .then( user => {
      req.userId = user;
      next();
    })
    .catch(err => {
      next(httpErrors(401, err.message));
    });
  });
};
