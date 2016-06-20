'use strict';

const debug = require('debug')('authdeity:deity-controller');
const Deity = require('../model/deity');
const httpErrors = require('http-errors');

exports.createDeity = function(reqBody){
  debug('deityController:create');
  return new Promise((resolve, reject) => {
    new Deity(reqBody).save()
    .then(deity => resolve(deity))
    .catch(err => reject(httpErrors(400, err.message)));
  });
};

exports.fetchDeity = function(id){
  debug('deityController:read');
  return new Promise((resolve, reject) => {
    Deity.findOne({_id: id})
    .then(deity => resolve(deity))
    .catch(err => reject(httpErrors(400, err.message)));
  });
};

exports.updateDeity = function(id, reqBody){
  debug('deityController:update');
  return new Promise((resolve, reject) => {
    Deity.findOneAndUpdate({_id: id}, {$set: reqBody}, {new: true})
    .then(deity => resolve(deity))
    .catch( err => reject(httpErrors(400, err.message)));
  });
};

exports.deleteDeity = function(id){
  debug('deityController:delete');
  return new Promise((resolve, reject) => {
    Deity.findOneAndRemove({_id: id})
    .then(deity => resolve(deity))
    .catch(err => reject(httpErrors(404, err.message)));
  });
};

exports.removeAllDeities = function(){
  debug('removeDeities');
  return Deity.remove({});
};
