'use strict';
const Mongoose = require('mongoose');
const crypto = require('crypto');

var TalentprofilSchema = new Mongoose.Schema({
  workSince: {type: Number},
  user: { type: Mongoose.Schema.Types.ObjectId, ref: 'User' },
  sector: { type: Mongoose.Schema.Types.ObjectId, ref: 'Sector' },
  adress: {type: String},
  description: {  type: Mongoose.Schema.Types.Mixed },

  fichiers: [{ type: Object }],
  isActive: { type: Boolean, default: 'true'},
}, {
  timestamps: true
});

Mongoose.model('Talentprofil', TalentprofilSchema);