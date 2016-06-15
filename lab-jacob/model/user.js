'use strict';

const httpErrors = require('http-errors');
const debug = require('debug')('authDeity:user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  findHash: {type: String, unique: true}
});

userSchema.methods.generateHash = function(password){
  debug('user:generateHash');
  return new Promise((resolve) => {
    bcrypt.hash(password, 8, (err, hash) => {
      this.password = hash;
      resolve(this);
    });
  });
};

userSchema.methods.compareHash = function(password){
  debug('user:compareHash');
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, this.password,  (err, result) => {
      if(err) return reject(err);
      if(!result) return reject(httpErrors(401, 'wrong password'));
      resolve(this);
    });
  });
};

userSchema.methods.generateFindHash = function(){
  debug('user:generateFindHash');
  return new Promise((resolve, reject) => {
    var tries = 0;
    _generateFindHash.call(this);

    function _generateFindHash(){
      this.findHash = crypto.ransBtyes(32).toString('hex');
      this.save()
      .then( () => resolve(this.findHash))
      .catch( (err) => {
        if(tries > 5) reject(err);
        tries++;
        _generateFindHash.call(this);
      });
    }
  });
};

userSchema.methjods.generateToken = function(){
  debug('user:generateToke');
  return new Promise((resolve, reject) => {
    this.generateFindHash()
    .then(findHash => resolve(jwt.sign({token: findHash}, process.enc.APP_SECRET)))
    .catch(reject);
  });
};
