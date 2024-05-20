const Joi = require('joi');

module.exports = {
  create: {
    message: Joi.any().required(),
    fichiers: Joi.array().required(),
    offer: Joi.string().required(),
    talent: Joi.string().required(),
    token: Joi.string().required(),
    sector: Joi.string().required(),
    business: Joi.string().required(),
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
    message: Joi.any().optional(),
    fichiers: Joi.array().optional(),
    offer: Joi.string().optional(),
    talent: Joi.string().optional(),
    sector: Joi.string().optional(),
    meeting_date: Joi.string().optional(),
    meeting_link: Joi.string().optional(),
    statut: Joi.string().optional(),
    business: Joi.string().optional(),
  },
  // updateWithFile: {
  //   objectdata: Joi.any().required(),
  //   fileprop: Joi.any().optional(),
  //   filenumber: Joi.number().optional(),
  //   filedata0: Joi.any().optional(),
  //   filedata1: Joi.any().optional(), 
  //   filedata2: Joi.any().optional(), 
  // },
  
  remove: {
    id: Joi.string().required()
  },
}