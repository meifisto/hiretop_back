const Joi = require('joi');

module.exports = {
  create: {
    workSince: Joi.number().required(), 
    sector: Joi.string().required(), 
    adress: Joi.string().required(), 
    description: Joi.any().required()
  },
  createWithFile: {
    token: Joi.string().required(),
    objectdata: Joi.any().required(),
    fileprop: Joi.any().optional(),
    filenumber: Joi.number().optional(),
    filedata0: Joi.any().optional(),
    filedata1: Joi.any().optional(),
    filedata2: Joi.any().optional(),
  },
  update: {
    workSince: Joi.number().optional(), 
    sector: Joi.string().optional(), 
    adress: Joi.string().optional(), 
    description: Joi.any().optional()
  },
  updateWithFile: {
    token: Joi.string().required(),
    objectdata: Joi.any().required(),
    fileprop: Joi.any().optional(),
    filenumber: Joi.number().optional(),
    filedata0: Joi.any().optional(),
    filedata1: Joi.any().optional(),
    filedata2: Joi.any().optional(),
  },
  remove: {
    id: Joi.string().required()
  }
}