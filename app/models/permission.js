'use strict';
const Mongoose = require('mongoose');

var PermissionSchema = new Mongoose.Schema({
  action: {type: String},
  subject: {type: String},
}, {
  timestamps: true
});

module.exports = Mongoose.model('Permission', PermissionSchema);