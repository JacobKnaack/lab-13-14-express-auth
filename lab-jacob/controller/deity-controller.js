'use strict';

const debug = require('debug')('authdeity:deity-controller');
const Deity = require('../model/deity');
const httpErrors = require('http-errors');

exports.createDeity = function(reqBody){
  debug('deityController');
  return new Promise((resolve, reject) => {
    new Deity(reqBody).save()
    .then(deity => resolve(deity))
    .catch(err => reject(httpErrors(400, err.message)));
  });
};
