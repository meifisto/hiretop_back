'use strict';
const MainController = require('../../controllers');
const RoutesTools = require('../../helpers/router_options');

/**
 * 
 * @param {*} routes Tableau contenant des objects de routes
 * @returns des objects de routes selon les standards de hapi js
 * @context Pour proteger une route il faut y ajouter une fonction 'pre' avec 'assign' === 'ability'
 * Nous avons ajouter un parametres 'extraconfig' mais le framework levait une exception car il ne reconnaissait pas ce
 * nouveau paramatre. Le code existant ne permettait pas non plus d'ajouter le pre directement sur les routes etant donner 
 * la cle 'config' provenait lui meme d'un import.
 * @Role Faire un merge entre la cle 'extraConfigs' et la cle 'config', est recommander si le parametre extraConfigs est utiliser sur un object de route
 * @TODO Deplacer cete fonction dans un autre fichier de sorte a l'importer dans les autre fichier de routes
 */

exports.plugin = {
  register: (plugin, options) => {
    const Modules = [
      {
        path: 'users/',
        ctrl: MainController.user,
      },
    ];

    const basePath = '/api/v1/';

    for (let i = 0; i < Modules.length; i++) {
      const mdl = Modules[i];  
      const modulePath = basePath + mdl.path;
      
      plugin.route(
        RoutesTools.buildConventionalRoute([
          {
            method: 'GET',
            path: modulePath + "{user}",
            config: mdl.ctrl.get(),
            extraConfigs: {
              pre: [
                { method: () => {return { action: "read", subject: 'Public' };}, assign: 'ability' },
              ]
            },
          },
          {
            method: 'GET',
            path: modulePath + 'me',
            config: mdl.ctrl.getDetails(),
            extraConfigs: {
              pre: [
                { method: () => {return { action: "read", subject: 'Public' };}, assign: 'ability' },              
              ]
            },
          },
          {
            method: 'GET',
            path: modulePath + 'list',
            config: mdl.ctrl.list(),
            extraConfigs: {
              pre: [
                { method: () => {return { action: "read", subject: 'Public' };}, assign: 'ability' },              
              ]
            },
          },
          {
            method: 'GET',
            path: modulePath + 'count',
            config: mdl.ctrl.count(),
            extraConfigs: {
              pre: [
                { method: () => {return { action: "read", subject: 'Public' };}, assign: 'ability' },              
              ]
            },
          },
          {
            method: 'POST',
            path: modulePath + 'login',
            config: mdl.ctrl.login(),
          },
          {
            method: 'POST',
            path: modulePath + 'register',
            config: mdl.ctrl.register(),
          },
          {
            method: 'POST',
            path: modulePath + 'confirm-email',
            config: mdl.ctrl.confirmEmail(),
            extraConfigs: {
              pre: [
                { method: () => {return { action: "read", subject: 'Public' };}, assign: 'ability' },              
              ]
            },
          },
          {
            method: 'POST',
            path: modulePath + 'register-file',
            config: mdl.ctrl.registerWithFile(),
            extraConfigs: {
              pre: [
                { method: () => {return { action: "read", subject: 'Public' };}, assign: 'ability' },              
              ]
            },
          },
          {
            method: 'POST',
            path: modulePath + 'forget-password',
            config: mdl.ctrl.forgetPassword(),
            extraConfigs: {
              pre: [
                { method: () => {return { action: "read", subject: 'Public' };}, assign: 'ability' },              
              ]
            },
          },
          {
            method: 'POST',
            path: modulePath + 'check-reset-code',
            config: mdl.ctrl.checkResetCode(),
            extraConfigs: {
              pre: [
                { method: () => {return { action: "read", subject: 'Public' };}, assign: 'ability' },              
              ]
            },
          },
          {
            method: 'PUT',
            path: modulePath + 'reset-password/{user}',
            config: mdl.ctrl.resetPassword(),
            extraConfigs: {
              pre: [
                { method: () => {return { action: "read", subject: 'Public' };}, assign: 'ability' },              
              ]
            },
          },
          {
            method: 'POST',
            path: modulePath + 'set-password',
            config: mdl.ctrl.setPassword(),
            extraConfigs: {
              pre: [
                { method: () => {return { action: "read", subject: 'Public' };}, assign: 'ability' },              
              ]
            },
          },
          {
            method: 'PUT',
            path: modulePath + '{user}',
            config: mdl.ctrl.update(),
            extraConfigs: {
              pre: [
                { method: () => {return { action: "read", subject: 'Public' };}, assign: 'ability' },              
              ]
            },
          },
          { 
            method: 'DELETE',
            path: modulePath + 'remove',
            config: mdl.ctrl.remove(),
            extraConfigs: {
              pre: [
                { method: () => {return { action: "read", subject: 'Public' };}, assign: 'ability' },              
              ]
            },
          },
        ])
      );
    } 


    plugin.route(
      RoutesTools.buildConventionalRoute([
        {
          method: 'GET',
          path: '/api/v1/check-token',
          config: MainController.user.checkToken(),
          extraConfigs: {
            pre: [
              { method: () => {return { action: "read", subject: 'Public' };}, assign: 'ability' },              
            ]
          },
        },
      ])
    );

  },
  pkg: require('../../../package.json'),
  name: 'user_routes_v1'
};