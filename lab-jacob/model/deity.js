'use strict';

const mongoose = require('mongoose');
const debug = require('debug')('authDeity:deity');

const deitySchema = mongoose.Schema({
  name: {type: String, required: true, unique: true},
  power: {type: String, required: true},
  userId: {type: mongoose.Schema.ObjectId, required: true}
});

debug('deitySchema');
module.exports = mongoose.model('deity', deitySchema);
