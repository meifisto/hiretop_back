const Joi = require('joi');

module.exports = {
  register: {
    token: Joi.string().required(),
    isConfirmEmail: Joi.boolean().optional(),
    email: Joi.string().email().required(),

    telephone: Joi.string().required(),
    password: Joi.string().required(),
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    business_associated: Joi.string().optional(),
    talent_associated: Joi.string().optional(),
  },
  login: {
    email: Joi.string().required(),
    password: Joi.string().required(),
    token: Joi.string().required(),
  },
  registerWithfile: {
    objectdata: Joi.any().required(),
    fileprop: Joi.any().required(),
    filenumber: Joi.number().required(),  
    filedata0: Joi.any().optional(), 
    filedata1: Joi.any().optional(), 
    filedata2: Joi.any().optional(), 
    filedata3: Joi.any().optional(), 
    filedata4: Joi.any().optional(), 
  },
  setPassword: {
    email: Joi.string().required(),
    password: Joi.string().required(),
  },


  
  forgetPassword: {
    email: Joi.string().required(),
  },
  checkResetCode: {
    email: Joi.string().required(),
    code: Joi.string().required(),
  },
  resetPassword: {
    password: Joi.string().optional(),
  },
  setPasswordPromoteur: {
    email: Joi.string().required(),
    password: Joi.string().required(),
  },
  confirmEmail: {
    email: Joi.string().required(),
    code: Joi.string().required(),
  },
  update: {
    isConfirmEmail: Joi.boolean().optional(),
    email: Joi.string().email().optional(),

    telephone: Joi.string().optional(),
    password: Joi.string().optional(),
    firstname: Joi.string().optional(),
    lastname: Joi.string().optional(),
    business_associated: Joi.string().optional(),
    talent_associated: Joi.string().optional(),
    isConfirmEmail: Joi.boolean().optional(),
  },
  validateEstablishmentInscription: {
    etablissementId: Joi.string().required(),
    // adminEtablissmentId: Joi.string().required(),
    adminEtablissementEmail: Joi.string().required(),
  },
  rejectEstablishmentInscription: {
    etablissementId: Joi.string().required(),
    // adminEtablissmentId: Joi.string().required(),
    adminEtablissementEmail: Joi.string().required(),
    // motif: Joi.string().required(),
  },
  remove: {
    id: Joi.string().required()
  }
}