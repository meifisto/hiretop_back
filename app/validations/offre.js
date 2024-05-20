const Joi = require('joi');

module.exports = {
  create: {
    titre: Joi.string().required(),
    contenu: Joi.any().required(),
    statut: Joi.string().optional(),
    sector: Joi.string().optional(),

    business_associated: Joi.string().required(),
  },
  createWithFile: {
    objectdata: Joi.any().required(),
    token: Joi.string().required(),
    fileprop: Joi.any().optional(),
    filenumber: Joi.number().optional(),  
    filedata0: Joi.any().optional(),
  },

  update: {
    titre: Joi.string().optional(),
    contenu: Joi.any().optional(),
    statut: Joi.string().optional(),
    sector: Joi.string().optional(),

    business_associated: Joi.string().optional(), 
  },
  remove: {
    id: Joi.string().required()
  },
  exportData: async () => {
    return {
      columns: [
        'dateArrivee','compagnieAerienne','nationalite','paysResidence','motifVoyage','dureeSejour','modeHebergement','villeCommune','possibiliteRemuneration','age','sexe','fullname','enqueteur',
        
        'auteur','auteurRole','validateur','secteur','reference',],
      name: 'forms-stats-hotels',
    };
  },
}