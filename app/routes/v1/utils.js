'use strict';
const Helper = require('../../helpers/index');
const MainController = require('../../controllers');
const StatistiqueController = require('../../controllers/statistique');
const storeDir = "files/store/"
const FormData = require('form-data');
const fs = require('fs');
const RoutesTools = require('../../helpers/router_options');

exports.plugin = {
  register: (plugin, options) => {
    console.log(  options )
    plugin.route(
      RoutesTools.buildConventionalRoute([
          {
            method: 'POST',
            path: '/api/v1/statisticsGlobals',
            config: MainController.stats.globalStats(),
            extraConfigs: {
              pre: [
                { method: () => { return { action: "read", subject: 'Public' } }, assign: 'ability' },
              ]
            },
          },
          {
            method: 'POST',
            path: '/api/v1/businessImpact',
            config: MainController.stats.businessImpact(),
            extraConfigs: {
              pre: [
                { method: () => { return { action: "read", subject: 'Public' } }, assign: 'ability' },
              ]
            },
          },
          {
            method: 'POST',
            path: '/api/v1/businessTalentRecommended',
            config: MainController.stats.businessTalentRecommended(),
            extraConfigs: {
              pre: [
                { method: () => { return { action: "read", subject: 'Public' } }, assign: 'ability' },
              ]
            },
          },
          // {
          //   method: 'POST',
          //   path: '/api/v1/statistics-transports',
          //   config: MainController.stats.statsTransports(),
          //   extraConfigs: {
          //     pre: [
          //       { method: () => { return { action: 'access', subject: 'statsTransports' } }, assign: 'ability' },
          //     ]
          //   },
          // },
        ])
    );
  },
  pkg: require('../../../package.json'),
  name: 'utils_routes_v1'
};