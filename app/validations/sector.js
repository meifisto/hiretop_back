const Joi = require('joi');

module.exports = {
  create: {
    nom: Joi.string().required(), 
    description: Joi.string().optional(),
    sousSecteurs: Joi.array().optional(),
    code: Joi.string().optional(), 
  },
  
  update: {
    nom: Joi.string().optional(), 
    description: Joi.string().optional(),
    sousSecteurs: Joi.array().optional(),
    code: Joi.string().optional(), 
  },

  remove: {
    id: Joi.string().required()
  }
}