'use strict';
const Mongoose = require('mongoose');
const crypto = require('crypto');

var BusinessprofilSchema = new Mongoose.Schema({
  social_raison: {type: String},
  sector: { type: Mongoose.Schema.Types.ObjectId, ref: 'Sector' },
  user: { type: Mongoose.Schema.Types.ObjectId, ref: 'User' },
  physical_address: {type: String},
  email: {type: String, unique: true },
  phonenumber: {type: String},
  agrement_legal_identification: {type: String},
  localization: {type: Object},
  description: {  type: Mongoose.Schema.Types.Mixed },

  legal_representant_fistname: {type: String},
  legal_representant_lastname: {type: String},
  legal_representant_email: {type: String},
  legal_representant_phonenumber: {type: String},
  fichiers: [{ type: Object }],
  isActive: { type: Boolean, default: 'true'},
}, {
  timestamps: true
});


Mongoose.model('Businessprofil', BusinessprofilSchema);