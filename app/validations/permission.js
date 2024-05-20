const Joi = require('joi');

module.exports = {
  create: {
    action: Joi.string().required(), 
    subject: Joi.string().required(),
  },

  update: {
    action: Joi.string().optional(), 
    subject: Joi.string().optional(),
  },

  remove: {
    id: Joi.string().required()
  }
}