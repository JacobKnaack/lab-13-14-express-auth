'use strict';

const debug = require('debug')('authDeity:basic-auth');
const httpErrors = require('http-errors');

module.exports = function(req, res, next){
  debug('parse-basic-auth');
  if(!req.headers.authorization)
    return next(httpErrors(401, 'need authorization header'));
  var authHeader = req.headers.authorization;
  var namePassword = authHeader.split(' ')[1];
  namePassword = new Buffer(namePassword, 'base64').toString('utf8');
  namePassword = namePassword.split(' ');
  req.auth = {
    username: namePassword[0],
    password: namePassword[1]
  };

  if(!req.auth.username)
    return next(httpErrors(401, 'no username given'));
  if(!req.auth.password)
    return next(httpErrors(401, 'no password given'));
};
