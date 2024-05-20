const Joi = require('joi');

module.exports = {
  create: {
    social_raison: Joi.string().required(), 
    sector: Joi.string().required(), 
    physical_address: Joi.string().required(), 
    email: Joi.string().required(), 
    description: Joi.any().required(), 
    phonenumber: Joi.string().required(), 
    agrement_legal_identification: Joi.string().required(), 
    localization: Joi.object().required(), 

    legal_representant_fistname: Joi.string().required(), 
    legal_representant_lastname: Joi.string().required(), 
    legal_representant_email: Joi.string().required(), 
    legal_representant_phonenumber: Joi.string().required(), 
  },
  createWithFile: {
    token: Joi.string().required(),
    objectdata: Joi.any().required(),
    fileprop: Joi.any().optional(),
    filenumber: Joi.number().optional(),  
    filedata0: Joi.any().optional(), 
    filedata1: Joi.any().optional(), 
    filedata2: Joi.any().optional(), 
    filedata3: Joi.any().optional(), 
    filedata4: Joi.any().optional(), 
  },
  update: {
    social_raison: Joi.string().required(), 
    sector: Joi.string().required(), 
    physical_address: Joi.string().required(), 
    email: Joi.string().required(), 
    description: Joi.any().required(), 
    phonenumber: Joi.string().required(), 
    agrement_legal_identification: Joi.string().required(), 
    localization: Joi.object().required(), 

    legal_representant_fistname: Joi.string().required(), 
    legal_representant_lastname: Joi.string().required(), 
    legal_representant_email: Joi.string().required(), 
    legal_representant_phonenumber: Joi.string().required(), 
  },
  updateWithFile: {
    token: Joi.string().required(),
    objectdata: Joi.any().required(),
    fileprop: Joi.any().optional(),
    filenumber: Joi.number().optional(),  
    filedata0: Joi.any().optional(), 
    filedata1: Joi.any().optional(), 
    filedata2: Joi.any().optional(), 
    filedata3: Joi.any().optional(), 
    filedata4: Joi.any().optional(), 
  },
  remove: {
    id: Joi.string().required()
  }
}