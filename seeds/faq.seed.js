const Mongoose = require('mongoose');
const { resolve } = require('path');


const faqModel = require('../app/models/faq.js')
const faqs = require('./faq.json')




exports.run = async function () {
    const existingItemsCount = await faqModel.countDocuments()
    if (existingItemsCount > 0) {
        console.error('faq table already exist. Skip seed');
        return
    }
    const insertRequest = await faqModel.insertMany(faqs.map(e => {
        delete e._id
        delete e.createdAt
        delete e.updatedAt
        delete e.__v
        return e
    }))
    console.log('Seed faq table succesfully :>> ', insertRequest);
}





