'use strict';

const aws = require('aws-sdk');
const uuid = require('uuid');
const sharp = require('sharp');
const Config = require("../../config/config");

const s3Options = Config.get('/s3');

aws.config.update({
  region: s3Options.region,
  accessKeyId: s3Options.accessKeyId,
  secretAccessKey: s3Options.secretAccessKey
});

const s3 = new aws.S3();

exports.buildConventionalRoute =  (routes) => {
    const inputs = [...routes]
    const singleRoute = (route) => {
        if (!route.extraConfigs) return route

        let { config } = route
        const { extraConfigs } = route
        config = { ...config, ...extraConfigs }

        delete route.extraConfigs
        route =  { ...route, config }
        return route
    }

    const results = (Array.isArray(inputs) ? inputs : []).map(route => {
        return singleRoute(route)
    });
    // console.log('results :>> ', results);
    return [...results]
}