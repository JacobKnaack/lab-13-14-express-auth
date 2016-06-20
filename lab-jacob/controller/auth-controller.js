'use strict';

// npm
const debug = require('debug')('authdeity:auth-controller');
const httpErrors = require('http-errors');

// app
const User = require('../model/user');

exports.signup = function(reqBody){ // function for signing up our new users
  debug('authControl-signup');
  return new Promise((resolve, reject) => {
    if(!reqBody.username || !reqBody.password) return reject(httpErrors(400, 'username and password required'));
    var password = reqBody.password;
    delete reqBody.password;
    var user = new User(reqBody);
    user.generateHash(password)
    .then(user => user.save())
    .then(user => user.generateToken())
    .then(token => resolve(token))
    .catch(reject);
  });
};

exports.signin = function(auth){ // function allowing user singin
  debug('authController-signin');
  return new Promise((resolve, reject) => {
    User.findOne({username: auth.username})
    .then( user => user.compareHash(auth.password))
    .then( user => user.generateToken())
    .then( token => resolve(token))
    .catch(reject);
  });
};
