const Mongoose = require('mongoose');
const { resolve } = require('path');


const typeetablissementModel = require('../app/models/typeetablissement.js')
const typesEtablissement = require('./type-etablissement.json')




exports.run = async function(){
    const existingItemsCount = await typeetablissementModel.countDocuments()
    if(existingItemsCount>0) {
        console.error('type-etablissement table already exist. Skip seed');
        return 
    }
    const insertRequest = await typeetablissementModel.insertMany(typesEtablissement) 
    console.log('Seed type-etablissement table succesfully :>> ', insertRequest);
}





