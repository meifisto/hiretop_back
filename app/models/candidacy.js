'use strict';
const Mongoose = require('mongoose');

var CandidacySchema = new Mongoose.Schema({
  message: { type: Mongoose.Schema.Types.Mixed },
  fichiers: [{ type: Object }],
  
  offer: {type: Mongoose.Schema.Types.ObjectId, ref: 'Offre' },
  talent: {type: Mongoose.Schema.Types.ObjectId, ref: 'Talentprofil' },
  talentUser: {type: Mongoose.Schema.Types.ObjectId, ref: 'User' },
  sector: {type: Mongoose.Schema.Types.ObjectId, ref: 'Sector' },
  business: {type: Mongoose.Schema.Types.ObjectId, ref: 'Businessprofil' },
  statut: {
    type: String,
    enum: [
      'saved','accepted','rejected','meeting_step','taken','abandoned'
    ],
    default: 'saved'
  },
  meeting_date: {type: String},
  meeting_link: {type: String},
}, {
  timestamps: true
});

module.exports = Mongoose.model('Candidacy', CandidacySchema);