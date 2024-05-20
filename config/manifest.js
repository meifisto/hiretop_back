'use strict';

const Confidence = require('confidence');
const Config = require('./config');
const Meta = require('./meta');
const Pack = require('../package');
const fs = require('fs');
const path = require('path');


let internals = {
  criteria: {
    env: process.env.NODE_ENV
  }
};

internals.manifest = {
  $meta: 'App manifest document',
  server: {
    host: process.env.SERVER_HOST,
    port: process.env.PORT,
    // tls: {
    //   key: fs.readFileSync(path.join(__dirname, '../certs/key.pem'), 'utf8'),
    //   cert: fs.readFileSync(path.join(__dirname, '../certs/cert.pem'), 'utf8')
    // },
    routes: {
      cors: {
        origin: ['*'], // an array of origins or 'ignore'
      }
    }
  },
  register: {
    plugins: [
      //* *************************************************************
      //                                                             *
      //                      COMMON PLUGINS                         *
      //                                                             *
      //* *************************************************************

      // //  App context decorator
      {
        plugin: './lib/context',
        options: {
          meta: Meta.get('/')
        }
      },
      //  MongoDB connector
      {
        plugin: './lib/mongoose',
        options: Config.get('/mongoose')
      },
      // //  Logging connector
      {
        plugin: 'good',
        options: Config.get('/good')
      },

      // //**************************************************************
      // //                                                             *
      // //                      WEB PLUGINS                            *
      // //                                                             *
      // //**************************************************************
      {
        plugin: 'inert'
      },
      {
        plugin: 'vision'
      },
      // Swagger support
      {
        plugin: 'hapi-swagger',
        options: {
          info: {
            title: 'Test API Documentation',
            version: Pack.version
          },
          host: process.env.SWAGGER_HOST,
          securityDefinitions: {
            'jwt': {
              'type': 'apiKey',
              'name': 'Authorization',
              'in': 'header'
            }
          },
          security: [{ 'jwt': [] }]
        }
      },
      // //**************************************************************
      // //                                                             *
      // //                      API PLUGINS                            *
      // //                                                             *
      // //**************************************************************

      // JWT authentication
      {
        plugin: 'hapi-auth-jwt2'
      },
      //  JWT-Authentication strategy
      {
        plugin: './lib/jwtAuth',
        options: Config.get('/jwtAuthOptions')
      },

      // //**************************************************************
      // //                                                             *
      // //                      APPLICATION ROUTES                     *
      // //                                                             *
      // //**************************************************************

      /* ----------------- Start mobile api routes -------------- */
      /* Version v1 apis */
      {
        plugin: './app/routes/v1/user.js'
      },
      {
        plugin: './app/routes/v1/resource.js'
      },
      {
        plugin: './app/routes/v1/utils.js'
      }
    ]
  }
};

internals.store = new Confidence.Store(internals.manifest);

exports.get = function (key) {
  return internals.store.get(key, internals.criteria);
};
exports.meta = function (key) {
  return internals.store.meta(key, internals.criteria);
};