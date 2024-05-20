const Mongoose = require('mongoose');
const { resolve } = require('path');


const secteurModel = require('../app/models/secteur.js')
const secteurs = require('./secteurs.json')




exports.run = async function(){
    const existingItemsCount = await secteurModel.countDocuments()
    if(existingItemsCount>0) {
        console.error('Secteurs table already exist. Skip seed');
        return 
    }
    const insertRequest = await secteurModel.insertMany(secteurs) 
    console.log('Seed Secteurs table succesfully :>> ', insertRequest);
    // console.log('existingItems :>> ', existingItems);  
}





