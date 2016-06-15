'use strict';

const debug = require('debug')('authDeity:userController');
const User = require('../model/user');

exports.removeAllUsers = function(){
  debug('removeAllUsers');
  return User.remove({});
};
