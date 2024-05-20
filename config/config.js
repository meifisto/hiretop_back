'use strict';

const Confidence = require('confidence');
var Fs = require('fs');
var Path = require('path');

// Confidence criteria
let internals = {
  criteria: {
    env: process.env.NODE_ENV
  }
};

//  Confidence document object
internals.config = {
  $meta: 'App configuration file',
  port: {
    web: {
      $filter: 'env',
      test: 9000,
      production: process.env.PORT,
      $default: 9200
    }
  },
  // tlsOptions: {
  //   key: Fs.readFileSync(Path.join(__dirname, 'ssl/key.pem'), 'utf8'),
  //   cert: Fs.readFileSync(Path.join(__dirname, 'ssl/cert.pem'), 'utf8')
  // },
  baseUrl: {
    $filter: 'env',
    $meta: 'values should not end in "/"',
    production: 'http://api.skooladmin.org',
    $default: 'http://127.0.0.1:9200'
  },
  mongoose: {
    $filter: 'env',
    production: {
      uri: process.env.ENVIRONMENT === 'DEV' ? process.env.DATABASE_URL_DEV : process.env.DATABASE_URL_PROD
    },
    test: {
      uri: 'mongodb://localhost:27017/skooladmintest'
    },
    $default: {
      uri: process.env.ENVIRONMENT === 'DEV' ? process.env.DATABASE_URL_DEV : process.env.DATABASE_URL_PROD,
      options: {}
    }
  },
  s3: {
    region: process.env.S3_REGION,
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_ACCESS_SECRET,
    bucket: process.env.S3_BUCKET
  },
  jwtAuthOptions: {
    key: process.env.JWT_SECRET,
    algorithm: 'HS256'
  },
  good: {
    ops: {
      interval: 1000
    },
    reporters: {
      myConsoleReporter: [{
        module: 'good-squeeze',
        name: 'Squeeze',
        args: [{ log: '*', response: '*' }]
      }, {
        module: 'good-console'
      }, 'stdout'],
      myFileReporter: [{
        module: 'good-squeeze',
        name: 'Squeeze',
        args: [{ error: '*', response: '*', log: '*', request: '*' }]
      }, {
        module: 'good-squeeze',
        name: 'SafeJson'
      }, {
        module: 'good-file',
        args: ['./logs/log']
      }],
      myHTTPReporter: [{
        module: 'good-squeeze',
        name: 'Squeeze',
        args: [{ error: '*' }]
      }, {
        module: 'good-http',
        args: ['http://localhost:8000/logs', {
          wreck: {
            headers: { 'x-api-key': 12345 }
          }
        }]
      }]
    }
  }
};

internals.store = new Confidence.Store(internals.config);

exports.get = function (key) {
  return internals.store.get(key, internals.criteria);
};

exports.meta = function (key) {
  return internals.store.meta(key, internals.criteria);
};