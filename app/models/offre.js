'use strict';
const Mongoose = require('mongoose');

var OffreSchema = new Mongoose.Schema({
  titre: {type: String},
  contenu: {  type: Mongoose.Schema.Types.Mixed },
  statut: {
    type: String,
    enum: ['saved','published','removed'],
    default: 'saved'
  },
  fichiers: [{ type: Object }],

  business_associated: {type: Mongoose.Schema.Types.ObjectId, ref: 'Businessprofil' },
  sector: {type: Mongoose.Schema.Types.ObjectId, ref: 'Sector' },
}, {
  timestamps: true
});

module.exports = Mongoose.model('Offre', OffreSchema);