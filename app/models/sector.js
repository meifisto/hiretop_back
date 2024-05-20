'use strict';
const Mongoose = require('mongoose');

var SectorSchema = new Mongoose.Schema({
  nom: {type: String},
  description: {type: String},
  sousSecteurs: [{type: String }],
  code: {type: String},
}, {
  timestamps: true
});

module.exports = Mongoose.model('Sector', SectorSchema);