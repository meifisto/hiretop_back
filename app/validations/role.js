const Joi = require('joi');

module.exports = {
  create: {
    nom: Joi.string().required(), 
    code: Joi.string().required(), 
    permissions: Joi.array().optional(),
  },

  update: {
    nom: Joi.string().optional(), 
    code: Joi.string().optional(), 
    permissions: Joi.array().optional(),
  },

  remove: {
    id: Joi.string().required()
  }
}