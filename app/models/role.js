'use strict';
const Mongoose = require('mongoose');

var RoleSchema = new Mongoose.Schema({
  nom: {type: String},
  code: {type: String},
  permissions: [{type: Mongoose.Schema.Types.ObjectId, ref: 'Permission' }],
}, {
  timestamps: true
});

module.exports = Mongoose.model('Role', RoleSchema);