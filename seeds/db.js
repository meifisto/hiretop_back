const Config = require('../config/config');

// const  mongoose = require('../lib/mongoose').plugin

const Mongoose = require('mongoose');
const Glob = require('glob');



const registerMongoDB = async (plugin, options) => {
    return new Promise((resolve, reject) => {
        Mongoose.connect(options.uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        }, function (err) {
            if (err) {
                console.log('Error in mongodb connection', err);
                throw err;
            }
        });

        // When the connection is connected
        Mongoose.connection.on('connected', function () {
            resolve(true)
            console.log('Mongo Database connected');
        });

        // When the connection is disconnected
        Mongoose.connection.on('disconnected', function () {
            // resolve(false)
            console.log(' Mongo Database disconnected');
        });

        // If the node process ends, close the mongoose connection

        process.on('SIGINT', function () {
            Mongoose.connection.close(function () {
                console.log('Mongo Database disconnected through app termination');
                process.exit(0);
            });
        });

        // Load models
        var models = Glob.sync('app/models/*.js');
        models.forEach(function (model) {
            require('../' + model);
        });
    })


}
// console.log('mongoose :>> ', mongoose);


exports.initDB = async function () {
    return new Promise(async (resolve, reject) => {
        const mongoConfigs = Config.get('/mongoose')
        await registerMongoDB({}, mongoConfigs).then((result) => {
            resolve(true)
        }).catch((err) => {
            reject(err)
        });
    })



}

