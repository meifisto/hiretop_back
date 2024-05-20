const Joi = require('joi');

module.exports = {
  create: {
    fullname: Joi.string().required(),
    sender: Joi.string().required(),
    receiver: Joi.string().required(),
    subject: Joi.string().required(),
    html: Joi.any().required(),
  },
  update: {
    fullname: Joi.string().optional(),
    sender: Joi.string().optional(),
    receiver: Joi.string().optional(),
    subject: Joi.string().optional(),
    html: Joi.any().optional(),
  },
  remove: {
    id: Joi.string().required()
  },
}