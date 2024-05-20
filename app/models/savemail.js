'use strict';
const Mongoose = require('mongoose');

var SavEmailSchema = new Mongoose.Schema({
  fullname: {type: String},
  sender: {type: String},
  receiver: {type: String},
  subject: {type: String},
  html: {  type: Mongoose.Schema.Types.Mixed },
}, {
  timestamps: true
});

module.exports = Mongoose.model('SavEmail', SavEmailSchema);