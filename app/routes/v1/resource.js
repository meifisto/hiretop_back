"use strict";
const MainController = require("../../controllers");
const RoutesTools = require("../../helpers/router_options");

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
        path: "businessprofiles/",
        ctrl: MainController.businessprofiles,
      },
      {
        path: "talentsprofiles/",
        ctrl: MainController.talentsprofiles,
      },
      {
        path: "candidacies/",
        ctrl: MainController.candidacy,
      },
      {
        path: "roles/",
        ctrl: MainController.role,
      },
      {
        path: "offres/",
        ctrl: MainController.offre,
      },
      {
        path: "savemails/",
        ctrl: MainController.savemail,
      },
      {
        path: "sectors/",
        ctrl: MainController.sector,
      },
      {
        path: "permissions/",
        ctrl: MainController.permission,
      },

      
    ];

    const basePath = "/api/v1/";

    for (let i = 0; i < Modules.length; i++) {
      const mdl = Modules[i];
      const modulePath = basePath + mdl.path;

      plugin.route(
        RoutesTools.buildConventionalRoute([
          {
            method: "GET",
            path: modulePath + "{resource}",
            config: mdl.ctrl.get(),
            extraConfigs: {
              pre: [
                {
                  method: () => {return { action: "read", subject: 'Public' };},
                  assign: "ability",
                },
              ],
            },
          },
          {
            method: "GET",
            path: modulePath + "list",
            config: mdl.ctrl.list(),
            extraConfigs: {
              pre: [
                {
                  method: () => {return { action: "read", subject: 'Public' };},
                  assign: "ability",
                },
              ],
            },
          },
          {
            method: "GET",
            path: modulePath + "list_all",
            config: mdl.ctrl.listAll(),
            extraConfigs: {
              pre: [
                {
                  method: () => {return { action: "read", subject: 'Public' };},
                  assign: "ability",
                },
              ],
            },
          },
          {
            method: "GET",
            path: modulePath + "count",
            config: mdl.ctrl.count(),
            extraConfigs: {
              pre: [
                {
                  method: () => {return { action: "read", subject: 'Public' };},
                  assign: "ability",
                },
              ],
            },
          },
          {
            method: "POST",
            path: modulePath + "create",
            config: mdl.ctrl.create(),
            extraConfigs: {
              pre: [
                {
                  method: () => {return { action: "read", subject: 'Public' };},
                  assign: "ability",
                },
              ],
            },
          },
          {
            method: "POST",
            path: modulePath + "create-file",
            config: mdl.ctrl.createWithFile(),
            extraConfigs: {
              pre: [
                {
                  method: () => {return { action: "read", subject: 'Public' };},
                  assign: "ability",
                },
              ],
            },
          },
          {
            method: "POST",
            path: modulePath + "create-many",
            config: mdl.ctrl.createMany(),
            extraConfigs: {
              pre: [
                {
                  method: () => {return { action: "read", subject: 'Public' };},
                  assign: "ability",
                },
              ],
            },
          },
          {
            method: "POST",
            path: modulePath + "createOrUpdate",
            config: mdl.ctrl.createOrUpdate(),
            extraConfigs: {
              pre: [
                {
                  method: () => {return { action: "read", subject: 'Public' };},
                  assign: "ability",
                },
              ],
            },
          },
          {
            method: "POST",
            path: modulePath + "import",
            config: mdl.ctrl.import(),
            extraConfigs: {
              pre: [
                {
                  method: () => {return { action: "read", subject: 'Public' };},
                  assign: "ability",
                },
              ],
            },
          },
          {
            method: "GET",
            path: modulePath + "export",
            config: mdl.ctrl.export(),
            extraConfigs: {
              pre: [
                {
                  method: () => {return { action: "read", subject: 'Public' };},
                  assign: "ability",
                },
              ],
            },
          },
          {
            method: "PUT",
            path: modulePath + "{resource}",
            config: mdl.ctrl.update(),
            extraConfigs: {
              pre: [
                {
                  method: () => {return { action: "read", subject: 'Public' };},
                  assign: "ability",
                },
              ],
            },
          },
          {
            method: "PUT",
            path: modulePath + "update-file/" + "{resource}",
            config: mdl.ctrl.updateWithFile(),
            extraConfigs: {
              pre: [
                {
                  method: () => {return { action: "read", subject: 'Public' };},
                  assign: "ability",
                },
              ],
            },
          },
          {
            method: "DELETE",
            path: modulePath + "remove",
            config: mdl.ctrl.remove(),
            extraConfigs: {
              pre: [
                {
                  method: () => {return { action: "read", subject: 'Public' };},
                  assign: "ability",
                },
              ],
            },
          },
          {
            method: "DELETE",
            path: modulePath + "removes",
            config: mdl.ctrl.removeMany(),
            extraConfigs: {
              pre: [
                {
                  method: () => {return { action: "read", subject: 'Public' };},
                  assign: "ability",
                },
              ],
            },
          },
          {
            method: "DELETE",
            path: modulePath + "removeAll",
            config: mdl.ctrl.removeAll(),
            extraConfigs: {
              pre: [
                {
                  method: () => {return { action: "read", subject: 'Public' };},
                  assign: "ability",
                },
              ],
            },
          },
        ])
      );
    }

    //custom routes
    plugin.route(
      RoutesTools.buildConventionalRoute([
        
      ])
    );

    plugin.route([
      {
        method: "GET",
        path: "/api/v1/test",
        config: {
          description: "Testing casl",
          auth: {
            strategy: "jwt",
            mode: "required",
            access: {
              entity: "app",
            },
          },
          pre: [
            {
              method: () => {
                return { action: "read", subject: "test" };
              },
              assign: "ability",
            },
          ],

          handler: async (request, h) => {
            return "hello";
          },
          tags: ["api"],
        },
      },
    ]);
  },
  pkg: require("../../../package.json"),
  name: "resource_routes_v1",
};
