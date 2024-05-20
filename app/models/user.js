'use strict';

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const crypto = require('crypto');

/**
 * Admin Schema
 */
var UserSchema = new Schema({
  email: { type: String, unique: true },
  telephone: { type: String },
  password: { type: String },
  firstname: { type: String },
  lastname: { type: String },
  business_associated: { type: Mongoose.Schema.Types.ObjectId, ref: 'Businessprofil' },
  talent_associated: { type: Mongoose.Schema.Types.ObjectId, ref: 'Talentprofil' },

  code: { type: String },
  isConfirmEmail: { type: Boolean, default: true },
  isResetPassord: { type: Boolean},
  fichiers: [{ type: Object }],
  role:  { type: Mongoose.Schema.Types.ObjectId, ref: 'Role' },
  // etablissement: { type: Mongoose.Schema.Types.ObjectId, ref: 'Inscription' },
},
{                                                                                       
  timestamps: true,
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
});

/**
 * Hook a pre save method to hash the password
 */
UserSchema.pre('save', function (next) {
  if (this.password && this.isModified('password')) {
    this.password = this.hashPassword(this.password);
  }
  next();
});

/**
 * Create instance method for hashing a password
 */
UserSchema.methods.hashPassword = function (password) {
  var shaSum = crypto.createHash('sha256');
  shaSum.update(password);
  return shaSum.digest('hex');
};

/**
 * Create instance method for authenticating Admin
 */
UserSchema.methods.authenticate = function (password) {
  return this.password === this.hashPassword(password);
};

// Mongoose.model('User', UserSchema);

module.exports = Mongoose.model('User', UserSchema);