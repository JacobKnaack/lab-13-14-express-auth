'use strict';

const debug = require('debug')('authdeity:auth-controller');

const User = require('../model/user');

exports.signup = function(reqBody){ // function for signing up our new users
  debug('authControll-signup');
  return new Promise((resolve, reject) => {
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
    .catch( token => resolve(token))
    .catch(reject);
  });
};
