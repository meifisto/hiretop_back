"use strict";
const MainHelper = require("../helpers");
// const UtilHelper = require('../helpers/utils');
// const Queue = require('../helpers/queue');
// const queue = Queue.queue
const endOfDay = require("date-fns/endOfDay");
const startOfDay = require("date-fns/startOfDay");
const moment = require("moment");
const storeDir = require("../helpers/storagepath").filesStoragePath;
// const json2xlsx = require('node-json-xlsx');
const fs = require("fs");
const { forEach } = require("lodash");
// const FormData = require('form-data');

module.exports = class StatistiqueController {
  // constructor (type, plural, validate) {
  //   this.type = type;
  //   this.plural = plural;
  //   this.validate = validate;
  // }

  globalStats() {
    return {
      description: "Returns globals stats",
      auth: false,
      handler: async (request, h) => {
        try {
          // Compter le nombre total de talents
          const totalTalents = await MainHelper['talentprofil'].count();
          
          // Compter le nombre total de structures
          const totalStructures = await MainHelper['businessprofil'].count();
          
          // Récupérer la liste des candidatures
          const candidacies = await MainHelper['candidacy'].list();
          
          // Effectuer l'agrégation pour compter le nombre de candidatures par statut
          const candidaturesByStatus = candidacies.reduce((acc, candidacy) => {
            acc[candidacy.statut] = (acc[candidacy.statut] || 0) + 1;
            return acc;
          }, {});

          // Compter le nombre total de candidatures
          const totalCandidatures = candidacies.length;

          return h.response({message : 'Traitement effectué', data: {
            totalTalents,
            totalStructures,
            totalCandidatures,
            candidaturesByStatus
          }}).code(200);

        } catch (error) {
          return error.message;
        }
      },
      tags: ["api"],
    };
  }

  businessImpact() {
    return {
      description: "Returns stats of business",
      auth: 'jwt',
      handler: async (request, h) => {
        try {
          const businessId = request.payload.businessId
          console.log('businessId::: ', businessId);
          if(!businessId) return h.response({message : 'businessId is required',}).code(200);

          // list des candidatures de la structure
          let candidacies = await MainHelper['candidacy'].list({business: businessId});
          console.log('candidacies::: ', candidacies);

          // Regrouper les candidatures par mois et calculer le total des candidatures par statut pour chaque mois
          const candidaciesByMonth = candidacies.reduce((acc, candidacy) => {
            const month = moment(candidacy.createdAt).format('YYYY-MM');
            if (!acc[month]) {
              acc[month] = {};
            }
            if (!acc[month][candidacy.statut]) {
              acc[month][candidacy.statut] = 0;
            }
            acc[month][candidacy.statut]++;
            return acc;
          }, {});
          console.log('candidaciesByMonth::: ', candidaciesByMonth);

          return h.response({
            message : 'Traitement effectué', 
            data: {
              candidaciesByMonth,
            }
          }).code(200);
        } catch (error) {
          return error.message;
        }
      },
      tags: ["api"],
    };
  }

  businessTalentRecommended() {
    return {
      description: "Returns recommended talents",
      auth: 'jwt',
      handler: async (request, h) => {
        try {
          const businessId = request.payload.businessId
          if(!businessId) return h.response({message : 'businessId is required',}).code(200);

          let current_business = await MainHelper['businessprofil'].get(businessId);
          const currentSector = current_business.sector && current_business.sector._id
          console.log('currentSector::: 🟢', currentSector);
          // list des candidatures de la structure
          let candidacies = await MainHelper['candidacy'].list({business: businessId});
          const talentIds = candidacies.map(item => item.talent._id.toString());
          // list des talents du même secteur
          let talentsWithCurrentSector = await MainHelper['talentprofil'].list({sector: currentSector});
          if( !talentsWithCurrentSector ) {
            return h.response({
              message : 'Traitement effectué', 
              data: {} 
            }).code(200);
          }
          // Filtrer les talents qui n'ont pas postulé à une offre de l'entreprise actuelle
          const newTalents = talentsWithCurrentSector.filter((talent) => {;
            if(!talentIds.includes(talent._id.toString())) return talent
          });
          console.log('newTalents::: ⭕️⭕️', newTalents);

          return h.response({
            message : 'Traitement effectué',
            data: {newTalents} 
          }).code(200);
        } catch (error) {
          return error.message;
        }
      },
      tags: ["api"],
    };
  }

  test() {
    return {
      description: "Route for tests ",
      auth: false,
      handler: async (request, h) => {
        try {
          // let data = ;
          let updateAgregat = await MainHelper["agregat"].updateOne(
            { table: "formstatagence" },
            { $inc: { count: 1 } },
            { upsert: true }
          );
          return h
            .response({
              message: "ook",
            })
            .code(200);
        } catch (error) {
          return error.message;
        }
      },
      tags: ["api"],
    };
  }
  statsForEstablishmentsAndFrontiers() {
    return {
      description: "Returns stats for promoter ",
      auth: "jwt",
      handler: async (request, h) => {
        try {
          // console.log('🔵🔵=======================================================');
          //control params
          if (!request.params.domaine || !request.payload.filter)
            return h.response({ message: "Mauvais paramètres" }).code(400);

          // prepare filter
          let filter = {};
          const filterData = request.payload.filter;
          if (
            filterData.text &&
            filterData.text.length > 0 &&
            filterData.type.length > 0
          ) {
            filter = { $or: [] };
            filterData.type.forEach((type, index) => {
              if (type === "createdAt" || type === "updatedAt") {
                let range = filterData.text[index].split(",");
                filter["$or"].push({
                  [type]: {
                    $gte: startOfDay(new Date(range[0])),
                    $lte: endOfDay(new Date(range[1])),
                  },
                });
              } else {
                if (
                  type === "etablissement" ||
                  type === "typeEtablissement" ||
                  type === "commissariat" ||
                  type === "roles"
                ) {
                  filter["$or"].push({ [type]: filterData.text[index] });
                } else {
                  filter["$or"].push({
                    [type]: new RegExp(filterData.text[index], "gi"),
                  });
                }
              }
            });
          }
          const params = { ...filter };
          // console.log("params: ❌ ❌ ❌", params, request.payload.codeTypeEtab);
          // console.log('request.params: ', request.params)
          // console.log('request.payload: ', request.payload)
          let result = [];

          // check if it's frontiere fiche
          if (request.params.domaine === "frontiere") {
            let tables = [
              "formfrontiereentreevoyageur",
              "formfrontieresortievoyageur",
            ];
            for (let index = 0; index < tables.length; index++) {
              const table = tables[index];
              // init variable
              let currentResults = {};
              currentResults.table = table;
              // load total fiches
              let result_total_fiches = await MainHelper[table].list(
                request.payload.id ? { commissariat: request.payload.id } : {}
              );
              // console.log('result_total_fiches.length: ', result_total_fiches.length)
              currentResults.total_fiches = result_total_fiches.length;
              result.push(currentResults);
            }
          }
          // check if it's establishment fiche
          if (request.params.domaine === "etablissement") {
            // load etablissement
            let etablissement = request.payload.id
              ? await MainHelper["inscription"].get(request.payload.id)
              : null;
            let codeTypeEtab = etablissement
              ? etablissement.typeEtablissement.code
              : request.payload.codeTypeEtab;

            if (!codeTypeEtab)
              return h.response({ message: "Mauvais paramètres" }).code(400);

            if (etablissement || codeTypeEtab) {
              // list of tables by roels
              let list_of_type_etablissements = {
                hotels: {
                  associated_tables: ["formstathotel", "formclienthotel"],
                },
                agence_restau: {
                  associated_tables: ["formstatrestau"],
                },
                agence_voyage: {
                  associated_tables: ["formstatagence"],
                },
                agence_transport: {
                  associated_tables: ["formstattransport"],
                },
                activite_sportive: {
                  associated_tables: ["formstatsport"],
                },
                activite_culturelle: {
                  associated_tables: ["formstatculture"],
                },
                agence_location: {
                  associated_tables: ["formstatlocationvehiculesansop"],
                },
              };
              let current_tables = list_of_type_etablissements[codeTypeEtab];
              let findEtabParams = {
                ...params,
              };
              if (request.payload.id)
                findEtabParams.etablissement = etablissement._id;

              switch (codeTypeEtab) {
                case "hotels":
                  // console.log("🔵🔵🔵", "hotels");
                  for (
                    let index = 0;
                    index < current_tables.associated_tables.length;
                    index++
                  ) {
                    const table = current_tables.associated_tables[index];
                    // init variable
                    let currentResults = {};
                    currentResults.table = table;
                    // load total fiches
                    let result_total_fiches = await MainHelper[table].list(
                      findEtabParams
                    );
                    currentResults.total = result_total_fiches.length;
                    // ================================================== control if it's formstathotel
                    // load total : charge salariale & arrivee & nuitee for mounth slips
                    if (index === 0) {
                      // traitement fiches stats
                      if (currentResults.total === 0) {
                        currentResults.total_charges_salariales = 0;
                        currentResults.total_arrives = 0;
                        currentResults.total_nuites = 0;
                      } else {
                        currentResults.total_charges_salariales = 0;
                        currentResults.total_arrives = 0;
                        currentResults.total_nuites = 0;
                        result_total_fiches.map((item) => {
                          if (item.chargesSalariales)
                            currentResults.total_charges_salariales +=
                              item.chargesSalariales;
                          if (item.nombreArrives)
                            currentResults.total_arrives += item.nombreArrives;
                          if (item.nombreNuites)
                            currentResults.total_nuites += item.nombreNuites;
                        });
                      }
                    }
                    // ================================================== control if it's formclienthotel
                    // load total : par sexe & par categorie socio pro
                    if (index === 1) {
                      // traitement fiches clientes
                      // sexe
                      currentResults.total_by_sexe = [];
                      let resultBySexe = await this.exportStatFromTableByField(
                        table,
                        ["sexe"]
                      );
                      resultBySexe[0].values.map((element, indexSexe) => {
                        // filter result by establishment
                        if (etablissement && currentResults.total != 0) {
                          let selectedResources = resultBySexe[0].resources[
                            indexSexe
                          ].filter((resource) => {
                            let id_1 = JSON.parse(
                              JSON.stringify(
                                resource &&
                                  resource.etablissement &&
                                  resource.etablissement._id
                              )
                            );
                            let id_2 = JSON.parse(
                              JSON.stringify(etablissement._id)
                            );
                            if (id_1 == id_2) {
                              return resource;
                            }
                          });
                          currentResults.total_by_sexe.push({
                            label: element,
                            value: selectedResources.length,
                          });
                        }
                        if (!etablissement && currentResults.total != 0) {
                          currentResults.total_by_sexe.push({
                            label: element,
                            value: resultBySexe[0].resourcesCount[indexSexe],
                          });
                        }
                        if (currentResults.total === 0) {
                          currentResults.total_by_sexe.push({
                            label: element,
                            value: 0,
                          });
                        }
                      });

                      // categorie_socio_pro
                      currentResults.total_by_categorie_socio_pro = [];
                      let resultByCategorieSocioPro =
                        await this.exportStatFromTableByField(table, [
                          "categorieSocioPro",
                        ]);
                      resultByCategorieSocioPro[0].values.map(
                        (element, indexCategorieSocioPro) => {
                          // filter result by establishment
                          if (etablissement && currentResults.total != 0) {
                            let selectedResources =
                              resultByCategorieSocioPro[0].resources[
                                indexCategorieSocioPro
                              ].filter((resource) => {
                                let id_1 = JSON.parse(
                                  JSON.stringify(
                                    resource &&
                                      resource.etablissement &&
                                      resource.etablissement._id
                                  )
                                );
                                let id_2 = JSON.parse(
                                  JSON.stringify(etablissement._id)
                                );
                                if (id_1 == id_2) {
                                  return resource;
                                }
                              });
                            currentResults.total_by_categorie_socio_pro.push({
                              label: element,
                              value: selectedResources.length,
                            });
                          }

                          if (!etablissement && currentResults.total != 0) {
                            currentResults.total_by_categorie_socio_pro.push({
                              label: element,
                              value:
                                resultByCategorieSocioPro[0].resourcesCount[
                                  indexCategorieSocioPro
                                ],
                            });
                          }
                          if (currentResults.total === 0) {
                            currentResults.total_by_categorie_socio_pro.push({
                              label: element,
                              value: 0,
                            });
                          }
                        }
                      );
                    }

                    result.push(currentResults);
                  }
                  break;
                case "agence_restau":
                  // console.log('🔵','agence restau')
                  for (
                    let index = 0;
                    index < current_tables.associated_tables.length;
                    index++
                  ) {
                    const table = current_tables.associated_tables[index];
                    // init variable
                    let currentResults = {};
                    currentResults.table = table;

                    // load total fiches
                    let result_total_fiches = await MainHelper[table].list(
                      findEtabParams
                    );

                    currentResults.total = result_total_fiches.length;
                    currentResults.chiffreAffaireGlobal = 0;
                    currentResults.total_places_disponibles = 0;
                    currentResults.total_employes_salariers = 0;

                    if (currentResults.total != 0) {
                      result_total_fiches.forEach((fiche, index) => {
                        // calcul total CA
                        currentResults.chiffreAffaireGlobal =
                          fiche.chiffreAffaireGlobal;
                        // calcul total place dispo
                        currentResults.total_places_disponibles =
                          fiche.capacitesAccueil.nombrePlaces;
                        // calcul total employés
                        currentResults.total_employes_salariers +=
                          fiche.employesSalaries.hommeTempspleinNationaux;
                        currentResults.total_employes_salariers +=
                          fiche.employesSalaries.hommeTempspartielNationaux;
                        currentResults.total_employes_salariers +=
                          fiche.employesSalaries.hommeTempspleinEtrangers;
                        currentResults.total_employes_salariers +=
                          fiche.employesSalaries.hommeTempspartielEtrangers;
                        currentResults.total_employes_salariers +=
                          fiche.employesSalaries.femmeTempspleinNationaux;
                        currentResults.total_employes_salariers +=
                          fiche.employesSalaries.femmeTempspartielNationaux;
                        currentResults.total_employes_salariers +=
                          fiche.employesSalaries.femmeTempspleinEtrangers;
                        currentResults.total_employes_salariers +=
                          fiche.employesSalaries.femmeTempspartielEtrangers;
                      });
                    }
                    // load total : charge salariale & arrivee & nuitee for mounth slips
                    if (index === 0) {
                      // control if it's formstatrestau
                      let lastMonth = result_total_fiches[0];
                    }
                    result.push(currentResults);
                  }
                  break;
                case "agence_voyage":
                  // console.log('🔵','voyage')
                  for (
                    let index = 0;
                    index < current_tables.associated_tables.length;
                    index++
                  ) {
                    const table = current_tables.associated_tables[index];
                    // console.log('table: ', table)
                    // init variable
                    let currentResults = {};
                    currentResults.table = table;

                    // load total fiches
                    let result_total_fiches = await MainHelper[table].list(
                      findEtabParams
                    );
                    // console.log(' 🩸 result_total_fiches: ', result_total_fiches.length)

                    currentResults.total = result_total_fiches.length;
                    currentResults.total_voyages_internes = 0;
                    currentResults.total_voyages_externes = 0;
                    currentResults.total_employes_salariers = 0;

                    if (currentResults.total != 0) {
                      result_total_fiches.forEach((fiche, index) => {
                        // calcul total voyages internes
                        currentResults.total_voyages_internes +=
                          fiche.voyagesInternes.sansFrais;
                        currentResults.total_voyages_internes +=
                          fiche.voyagesInternes.avecFrais;
                        // calcul total voyages externes
                        currentResults.total_voyages_externes +=
                          fiche.voyagesInternationaux.entreeSansFrais;
                        currentResults.total_voyages_externes +=
                          fiche.voyagesInternationaux.entreeAvecFrais;
                        currentResults.total_voyages_externes +=
                          fiche.voyagesInternationaux.sortieSansFrais;
                        currentResults.total_voyages_externes +=
                          fiche.voyagesInternationaux.sortieAvecFrais;
                        // calcul total employés
                        currentResults.total_employes_salariers +=
                          fiche.employesSalaries.hommeTempspleinNationaux;
                        currentResults.total_employes_salariers +=
                          fiche.employesSalaries.hommeTempspartielNationaux;
                        currentResults.total_employes_salariers +=
                          fiche.employesSalaries.hommeTempspleinEtrangers;
                        currentResults.total_employes_salariers +=
                          fiche.employesSalaries.hommeTempspartielEtrangers;
                        currentResults.total_employes_salariers +=
                          fiche.employesSalaries.femmeTempspleinNationaux;
                        currentResults.total_employes_salariers +=
                          fiche.employesSalaries.femmeTempspartielNationaux;
                        currentResults.total_employes_salariers +=
                          fiche.employesSalaries.femmeTempspleinEtrangers;
                        currentResults.total_employes_salariers +=
                          fiche.employesSalaries.femmeTempspartielEtrangers;
                      });
                    }

                    result.push(currentResults);
                  }
                  break;
                case "agence_transport":
                  // console.log('🔵','agence_transport')
                  for (
                    let index = 0;
                    index < current_tables.associated_tables.length;
                    index++
                  ) {
                    const table = current_tables.associated_tables[index];
                    // console.log('table: ', table)
                    // init variable
                    let currentResults = {};
                    currentResults.table = table;

                    // load total fiches
                    let result_total_fiches = await MainHelper[table].list(
                      findEtabParams
                    );
                    // console.log('result_total_fiches: ', result_total_fiches.length)

                    currentResults.total = result_total_fiches.length;
                    currentResults.chiffreAffaireGlobal = 0;
                    currentResults.total_voyageurs_transporter = 0;
                    currentResults.total_employes_salariers = 0;

                    if (currentResults.total != 0) {
                      result_total_fiches.forEach((fiche, index) => {
                        // calcul total CA
                        currentResults.chiffreAffaireGlobal =
                          fiche.chiffreAffaireGlobal;
                        // calcul total voyageurs transporter
                        currentResults.total_voyageurs_transporter =
                          fiche.capacitesAccueil.nombreVoyageursTransporter;
                        // calcul total employés
                        currentResults.total_employes_salariers +=
                          fiche.employesSalaries.hommeTempspleinNationaux;
                        currentResults.total_employes_salariers +=
                          fiche.employesSalaries.hommeTempspartielNationaux;
                        currentResults.total_employes_salariers +=
                          fiche.employesSalaries.hommeTempspleinEtrangers;
                        currentResults.total_employes_salariers +=
                          fiche.employesSalaries.hommeTempspartielEtrangers;
                        currentResults.total_employes_salariers +=
                          fiche.employesSalaries.femmeTempspleinNationaux;
                        currentResults.total_employes_salariers +=
                          fiche.employesSalaries.femmeTempspartielNationaux;
                        currentResults.total_employes_salariers +=
                          fiche.employesSalaries.femmeTempspleinEtrangers;
                        currentResults.total_employes_salariers +=
                          fiche.employesSalaries.femmeTempspartielEtrangers;
                      });
                    }
                    result.push(currentResults);
                  }
                  break;
                case "activite_sportive":
                  // console.log('🔵','activite_sportive')
                  for (
                    let index = 0;
                    index < current_tables.associated_tables.length;
                    index++
                  ) {
                    const table = current_tables.associated_tables[index];
                    // console.log('table: ', table)
                    // init variable
                    let currentResults = {};
                    currentResults.table = table;

                    // load total fiches
                    let result_total_fiches = await MainHelper[table].list(
                      findEtabParams
                    );
                    // console.log('result_total_fiches: ', result_total_fiches.length)

                    currentResults.total = result_total_fiches.length;
                    currentResults.chiffreAffaireGlobal = 0;
                    currentResults.total_visiteurs = 0;
                    currentResults.total_employes_salariers = 0;

                    if (currentResults.total != 0) {
                      result_total_fiches.forEach((fiche, index) => {
                        // calcul total CA
                        currentResults.chiffreAffaireGlobal =
                          fiche.chiffreAffaireGlobalTotal;
                        // calcul total voyageurs transporter
                        currentResults.total_visiteurs =
                          fiche.capacitesAccueil.nombreVisitesNationaux +
                          fiche.capacitesAccueil.nombreVisitesInterNationaux;
                        // calcul total employés
                        currentResults.total_employes_salariers +=
                          fiche.employesSalaries.hommeTempspleinNationaux;
                        currentResults.total_employes_salariers +=
                          fiche.employesSalaries.hommeTempspartielNationaux;
                        currentResults.total_employes_salariers +=
                          fiche.employesSalaries.hommeTempspleinEtrangers;
                        currentResults.total_employes_salariers +=
                          fiche.employesSalaries.hommeTempspartielEtrangers;
                        currentResults.total_employes_salariers +=
                          fiche.employesSalaries.femmeTempspleinNationaux;
                        currentResults.total_employes_salariers +=
                          fiche.employesSalaries.femmeTempspartielNationaux;
                        currentResults.total_employes_salariers +=
                          fiche.employesSalaries.femmeTempspleinEtrangers;
                        currentResults.total_employes_salariers +=
                          fiche.employesSalaries.femmeTempspartielEtrangers;
                      });
                    }
                    result.push(currentResults);
                  }
                  break;
                case "activite_culturelle":
                  // console.log("🔵", "activite_culturelle");
                  for (
                    let index = 0;
                    index < current_tables.associated_tables.length;
                    index++
                  ) {
                    const table = current_tables.associated_tables[index];
                    // init variable
                    let currentResults = {};
                    currentResults.table = table;

                    // load total fiches
                    let result_total_fiches = await MainHelper[table].list(
                      findEtabParams
                    );

                    currentResults.total = result_total_fiches.length;
                    currentResults.chiffreAffaireGlobal = 0;
                    currentResults.total_visiteurs = 0;
                    currentResults.total_employes_salariers = 0;

                    if (currentResults.total != 0) {
                      result_total_fiches.forEach((fiche, index) => {
                        // calcul total CA
                        currentResults.chiffreAffaireGlobal =
                          fiche.chiffreAffaireGlobalTotal;
                        // calcul total voyageurs transporter
                        currentResults.total_visiteurs =
                          fiche.capacitesAccueil.nombreVisitesNationaux +
                          fiche.capacitesAccueil.nombreVisitesInterNationaux;
                        // calcul total employés
                        currentResults.total_employes_salariers +=
                          fiche.employesSalaries.hommeTempspleinNationaux;
                        currentResults.total_employes_salariers +=
                          fiche.employesSalaries.hommeTempspartielNationaux;
                        currentResults.total_employes_salariers +=
                          fiche.employesSalaries.hommeTempspleinEtrangers;
                        currentResults.total_employes_salariers +=
                          fiche.employesSalaries.hommeTempspartielEtrangers;
                        currentResults.total_employes_salariers +=
                          fiche.employesSalaries.femmeTempspleinNationaux;
                        currentResults.total_employes_salariers +=
                          fiche.employesSalaries.femmeTempspartielNationaux;
                        currentResults.total_employes_salariers +=
                          fiche.employesSalaries.femmeTempspleinEtrangers;
                        currentResults.total_employes_salariers +=
                          fiche.employesSalaries.femmeTempspartielEtrangers;
                      });
                    }
                    result.push(currentResults);
                    // console.log('result: ', result)
                  }
                  break;
                case "agence_location":
                  // console.log('🔵','agence_location')
                  for (
                    let index = 0;
                    index < current_tables.associated_tables.length;
                    index++
                  ) {
                    const table = current_tables.associated_tables[index];
                    // console.log('table: ', table)
                    // init variable
                    let currentResults = {};
                    currentResults.table = table;

                    // load total fiches
                    let result_total_fiches = await MainHelper[table].list(
                      findEtabParams
                    );
                    // console.log('result_total_fiches: ', result_total_fiches.length)

                    currentResults.total = result_total_fiches.length;
                    currentResults.chiffreAffaireGlobal = 0;
                    currentResults.total_vehicules_jour = 0;
                    currentResults.total_employes_salariers = 0;

                    if (currentResults.total != 0) {
                      result_total_fiches.forEach((fiche, index) => {
                        // calcul total CA
                        currentResults.chiffreAffaireGlobal =
                          fiche.chiffreAffaireGlobal;
                        // calcul total vehicule effectivement loue par jour
                        currentResults.total_vehicules_jour =
                          fiche.capacitesAccueil.nombreVehiculesJour;
                        // calcul total employés
                        currentResults.total_employes_salariers +=
                          fiche.employesSalaries.hommeTempspleinNationaux;
                        currentResults.total_employes_salariers +=
                          fiche.employesSalaries.hommeTempspartielNationaux;
                        currentResults.total_employes_salariers +=
                          fiche.employesSalaries.hommeTempspleinEtrangers;
                        currentResults.total_employes_salariers +=
                          fiche.employesSalaries.hommeTempspartielEtrangers;
                        currentResults.total_employes_salariers +=
                          fiche.employesSalaries.femmeTempspleinNationaux;
                        currentResults.total_employes_salariers +=
                          fiche.employesSalaries.femmeTempspartielNationaux;
                        currentResults.total_employes_salariers +=
                          fiche.employesSalaries.femmeTempspleinEtrangers;
                        currentResults.total_employes_salariers +=
                          fiche.employesSalaries.femmeTempspartielEtrangers;
                      });
                    }
                    result.push(currentResults);
                  }
                  break;
              }
            } else {
              return h
                .response({
                  message: "Etablissement(s) associé(s) introuvable(s)",
                })
                .code(400);
            }
          }
          // recup stats
          // console.log('result: ', result)
          // console.log('🔵🔵=======================================================');
          return h.response({ resources: result }).code(200);
        } catch (error) {
          return error.message;
        }
      },
      tags: ["api"],
    };
  }

  statsTable() {
    return {
      description: "Returns stats of " + this.plural,
      auth: false,
      handler: async (request, h) => {
        try {
          //control
          if (!request.payload.fields || !request.params.table)
            return h.response({ message: "Mauvais paramètres" }).code(400);
          let result = await this.exportStatFromTableByField(
            request.params.table,
            request.payload.fields
          );
          return h.response({ resources: result }).code(200);
        } catch (error) {
          return error.message;
        }
      },
      tags: ["api"],
    };
  }

  // ---------------------------------------------------------------------------------------------------

  statsTransports() {
    return {
      description: "Returns stats of transports",
      auth: false,
      handler: async (request, h) => {
        try {
          // return h.response({message: 'Done'}).code(200);   {"confirmeForStat":{$exists:true}}
          let result = {};
          let resources = [];

          // let query = {"confirmeForStat":{$exists:true}}
          let query = {};
          let filter = {};

          let totalTransportParAvion = 0;
          let totalTransportParRoute = 0;
          let totalTransportParEau = 0;
          let totalTransportParTrain = 0;
          let totalVehiculesDisponiblesLocations = 0;
          let totalVehiculesDisponiblesJour = 0;
          let totalNombreVehiculesJour = 0;
          // transport
          let totalNombrePlacesDisponibles = 0;
          let totalNombrePlacesDisponiblesParEau = 0;
          let totalNombrePlacesDisponiblesParRoute = 0;
          let totalNombrePlacesDisponiblesParAvion = 0;
          let totalNombrePlacesDisponiblesParTrain = 0;

          let totalNombreVoyageursTransporter = 0;

          if (request.payload.options) query = { ...request.payload.options };

          //prepare filter ------------------------------------------------
          if (request.payload.filtre) {
            const filterData = request.payload.filtre;
            if (filterData.text) {
              filter = { $or: [] };
              filterData.type.forEach((type) => {
                if (type == ("createdAt" || "updatedAt")) {
                  let range = filterData.text[0].split(",");
                  filter["$or"].push({
                    [type]: {
                      $gte: startOfDay(new Date(range[0])),
                      $lte: endOfDay(new Date(range[1])),
                    },
                  });
                } else {
                  filter["$or"].push({
                    [type]: new RegExp(filterData.text, "gi"),
                  });
                }
              });
            }
          }

          const params = {
            ...query,
            ...filter,
          };

          //fetch data in back end
          if (request.payload.tables) {
            for (let i = 0; i < request.payload.tables.length; i++) {
              let table = request.payload.tables[i];
              let result = await MainHelper[table].list(params, 0, 200, {});
              resources.push(...result);
            }
          } else {
            if (request.payload.table)
              resources = await MainHelper[request.payload.table].list(
                params,
                0,
                200,
                {}
              );
          }
          // filter result by extra attribut end --------------------------------------------------

          // return h.response({message: 'Done'}).code(200);

          // building filnal response --------------------------------------------------------------------
          result["options"] = [];

          resources.map((e) => {
            // prepare object -------------------------------------------------------------------------------
            let object = {
              id: e._id,
              // confirmeForStat: e.confirmeForStat
            };
            // -------------------------------------------------------------------------------------
            if (e.annee) object.annee = e.annee;
            if (e.mois) object.mois = e.mois;
            if (e.departement) object.departement = e.departement;
            if (e.commune) object.commune = e.commune;
            if (e.arrondissement) object.arrondissement = e.arrondissement;

            if (e.typeTransport) {
              object.typeTransport = e.typeTransport;
              if (e.typeTransport === "Par eau") totalTransportParEau += 1;
              if (e.typeTransport === "Par route") totalTransportParRoute += 1;
              if (e.typeTransport === "Par avion") totalTransportParAvion += 1;
              if (e.typeTransport === "Par train") totalTransportParTrain += 1;
            }

            if (e.capacitesAccueil) {
              if (e.capacitesAccueil.vehiculesDisponiblesLocations) {
                object.vehiculesDisponiblesLocations =
                  e.capacitesAccueil.vehiculesDisponiblesLocations;
                totalVehiculesDisponiblesLocations +=
                  e.capacitesAccueil.vehiculesDisponiblesLocations;

                if (e.typeTransport) {
                  if (e.typeTransport === "Par eau") {
                    totalNombrePlacesDisponiblesParEau +=
                      e.capacitesAccueil.vehiculesDisponiblesLocations;
                  }
                  if (e.typeTransport === "Par route") {
                    totalNombrePlacesDisponiblesParRoute +=
                      e.capacitesAccueil.vehiculesDisponiblesLocations;
                  }
                  if (e.typeTransport === "Par avion") {
                    totalNombrePlacesDisponiblesParAvion +=
                      e.capacitesAccueil.vehiculesDisponiblesLocations;
                  }
                  if (e.typeTransport === "Par train") {
                    totalNombrePlacesDisponiblesParTrain +=
                      e.capacitesAccueil.vehiculesDisponiblesLocations;
                  }
                }
              }
              if (e.capacitesAccueil.vehiculesDisponiblesJour) {
                object.vehiculesDisponiblesJour =
                  e.capacitesAccueil.vehiculesDisponiblesJour;
                totalVehiculesDisponiblesJour +=
                  e.capacitesAccueil.vehiculesDisponiblesJour;
              }
              if (e.capacitesAccueil.nombreVehiculesJour) {
                object.nombreVehiculesJour =
                  e.capacitesAccueil.nombreVehiculesJour;
                totalNombreVehiculesJour +=
                  e.capacitesAccueil.nombreVehiculesJour;
              }
              // transport
              if (e.capacitesAccueil.nombrePlacesDisponibles) {
                object.nombrePlacesDisponibles =
                  e.capacitesAccueil.nombrePlacesDisponibles;
                totalNombrePlacesDisponibles +=
                  e.capacitesAccueil.nombrePlacesDisponibles;
              }
            }

            result["options"].push(object);
            return e;
          });

          result.total = {};
          result.total.total = result.options.length;

          result.total.transportParEau = totalTransportParEau; //✅
          result.total.transportParRoute = totalTransportParRoute; //✅
          result.total.transportParAvion = totalTransportParAvion; //✅
          result.total.transportParTrain = totalTransportParTrain; //✅

          if (result.options.length > 0) {
            result.total.moyenneTransportParEau =
              totalTransportParEau / result.options.length; //✅
            result.total.moyenneTransportParroute =
              totalTransportParRoute / result.options.length; //✅
            result.total.moyenneTransportParRoute =
              totalTransportParAvion / result.options.length; //✅
            result.total.moyenneTransportParTrain =
              totalTransportParTrain / result.options.length; //✅
          }
          // location
          result.total.vehiculesDisponiblesLocations =
            totalVehiculesDisponiblesLocations; //✅
          result.total.vehiculesDisponiblesJour = totalVehiculesDisponiblesJour; //✅
          result.total.vehiculesJour = totalNombreVehiculesJour; //✅
          // transport
          result.total.placesDisponibles = totalNombrePlacesDisponibles; //✅

          result.total.placesDisponiblesParEau =
            totalNombrePlacesDisponiblesParEau; //✅
          result.total.placesDisponiblesParRoute =
            totalNombrePlacesDisponiblesParRoute; //✅
          result.total.placesDisponiblesParAvion =
            totalNombrePlacesDisponiblesParAvion; //✅
          result.total.placesDisponiblesParTrain =
            totalNombrePlacesDisponiblesParTrain; //✅

          return h.response({ message: "Done", resources: result }).code(200);
        } catch (error) {
          return error.message;
        }
      },
      tags: ["api"],
    };
  }

  statsExploitationFrontières() {
    return {
      description: "Returns stats of " + this.plural,
      auth: false,
      handler: async (request, h) => {
        try {
          // return h.response({message: 'Done'}).code(200);
          let result = {};
          let resources = [];

          let query = {};
          let queryExtra = {};

          let tablesExtra = [];

          let filter = {};
          // let filterExtraList = ["motifVoyage"]
          let filterExtra = [];

          let formsSortieFrontiere = ["formfrontieresortievoyageur"]; //"formtourismeemetteur",
          let formsEntreeFrontiere = ["formfrontiereentreevoyageur"]; //"formtourismerecepteur",

          let totalDureeSejour = 0;
          let totalEntreeFrontiere = 0;
          let totalSortieFrontiere = 0;

          if (request.payload.options) query = { ...request.payload.options };

          //load extra tables ------------------------------------------
          // if(request.payload.tables){
          //   request.payload.tables.forEach((table) => {
          //     if( table == ("formtourismeinterne") ){
          //       tablesExtra.push(table)
          //       const index = request.payload.tables.indexOf(table);
          //       request.payload.tables.splice(index, 1)
          //     }
          //   })
          // }

          //load extra tables end ------------------------------------------

          // //load extra option ------------------------------------------
          // queryExtraList.forEach( (currentQuery) => {
          //   if( query[currentQuery] ){
          //     queryExtra[currentQuery] = query[currentQuery]
          //     delete query[currentQuery]
          //   }
          // })
          // //load extra option end ------------------------------------------
          // //load extra filter ------------------------------------------
          // queryExtraList.forEach( (currentQuery) => {
          //   if( query[currentQuery] ){
          //     queryExtra[currentQuery] = query[currentQuery]
          //     delete query[currentQuery]
          //   }
          // })
          // //load extra filter end ------------------------------------------

          //prepare filter ------------------------------------------
          if (request.payload.filtre) {
            for (
              let index = 0;
              index < request.payload.filtre.type.length;
              index++
            ) {
              // remove extra attribut for filter
              if (request.payload.filtre.type[index] === "motifVoyage") {
                filterExtra.push({
                  type: request.payload.filtre.type[index],
                  text: request.payload.filtre.text[index],
                });
                request.payload.filtre.type.splice(index, 1);
                request.payload.filtre.text.splice(index, 1);
              }
            }
            // load filter
            filter["$or"] = [];

            const filterData = request.payload.filtre;
            filterData.type.forEach((type, index) => {
              if (type === "createdAt" || type === "updatedAt") {
                let range = filterData.text[index].split(",");
                filter["$or"].push({
                  [type]: {
                    $gte: startOfDay(new Date(range[0])),
                    $lte: endOfDay(new Date(range[1])),
                  },
                });
              } else {
                if (
                  type === "etablissement" ||
                  type === "typeEtablissement" ||
                  type === "commissariat"
                ) {
                  filter["$or"].push({ [type]: filterData.text[0] });
                } else {
                  filter["$or"].push({
                    [type]: new RegExp(filterData.text, "gi"),
                  });
                }
              }
            });
          }

          //prepare filter end ------------------------------------------

          //load extra filter ------------------------------------------
          // filter.$or.forEach((filtre) => {
          //   if( filtre ){
          //   }
          //   return filtre
          // })
          //load extra filter end ------------------------------------------

          const params = {
            ...query,
            ...filter,
          };

          // fetch data in back end (current table) --------------------------------------------------
          if (request.payload.tables) {
            for (let i = 0; i < request.payload.tables.length; i++) {
              let table = request.payload.tables[i];
              let result = await MainHelper[table].list(params, 0, 200, {});

              if (formsSortieFrontiere.includes(table)) {
                totalSortieFrontiere += result.length;
              } // compte sortie frontière terrestre

              if (formsEntreeFrontiere.includes(table)) {
                totalEntreeFrontiere += result.length;
              } // compte entree frontière terrestre

              resources.push(...result);
            }
          } else {
            if (request.payload.table) {
              resources = await MainHelper[request.payload.table].list(
                params,
                0,
                200,
                {}
              );
            }
          }
          // fetch data in back end (extra table) --------------------------------------------------
          // let resourcesExtra = []
          // if( tablesExtra.length > 0 ){
          //   for(let i = 0; i < tablesExtra.length; i++){
          //     let result = await MainHelper[tablesExtra[i]].list({}, 0, 200, {})
          //     resourcesExtra.push(...result)
          //   }
          // }
          // filter (extra table) --------------------------------------------------
          // resourcesExtra.filter((res) => {
          //   return res
          // })

          // filter result by filterExtra --------------------------------------------------
          filterExtra.forEach((currentFilter) => {
            const { type, text } = currentFilter;
            resources.filter((resource) => {
              if (
                resource[type].includes(text) ||
                resource.sejourEtranger[type].includes(text) ||
                resource.sejourBenin[type].includes(text)
              )
                return resource;
            });
          });

          // filter result by filterExtra end --------------------------------------------------

          // building filnal response --------------------------------------------------------------------
          result["options"] = [];

          resources.map((e) => {
            // prepare object -------------------------------------------------------------------------------
            let object = {
              id: e._id,
            };
            // -------------------------------------------------------------------------------------
            //durée séjour  ------------------------------------------------------
            if (e.dureeSejour) {
              totalDureeSejour += e.dureeSejour;
              object.dureeSejour = e.dureeSejour;
            } else {
              totalDureeSejour +=
                e.sejourEtranger.dureeSejour || e.sejourBenin.dureeSejour;
              object.dureeSejour =
                e.sejourEtranger.dureeSejour || e.sejourBenin.dureeSejour;
            }

            // let currentTotalNombreNuit = 0
            //durée séjour tourisme emetteur & recepteur -------------------------
            // if( e.nombreNuitParType ){
            //   e.nombreNuitParType.forEach((type)=>{
            //     if(type.nombreNuit != null || type.nombreNuit > 0){
            //       currentTotalNombreNuit += type.nombreNuit
            //     }
            //     return type
            //   })
            //   if(currentTotalNombreNuit > 0 ){
            //     object.dureeSejour = currentTotalNombreNuit
            //     totalDureeSejour += currentTotalNombreNuit
            //   }
            // }
            //durée séjour tourisme emetteur & recepteur end -------------------------
            //durée séjour tourisme recepteur ---------------------------------------
            // if(e.tableau1 && e.tableau1.length > 0){
            //   e.tableau1.forEach((voyage)=>{
            //     if( voyage.nombreNuits != null ){
            //       currentTotalNombreNuit += voyage.nombreNuits
            //     }
            //   })
            // }
            // if(e.tableau2 && e.tableau2.length > 0){
            //   e.tableau2.forEach((voyage)=>{
            //     if( voyage.nombreNuits != null ){
            //       currentTotalNombreNuit += voyage.nombreNuits
            //     }
            //   })
            // }
            // if ( currentTotalNombreNuit > 0 ){
            //   object.dureeSejour = currentTotalNombreNuit
            //   totalDureeSejour += currentTotalNombreNuit
            // }
            //durée séjour tourisme recepteur end -------------------------------------

            // if( e.annee ) object.annee = e.annee
            // if( e.mois ) object.mois = e.mois
            // if( e.chiffreAffaireGlobal ) object.chiffreAffaireGlobal = e.chiffreAffaireGlobal
            // if( e.nombreNuites ) object.nombreNuites = e.nombreNuites
            // if( e.nombreArrives ) object.nombreArrives = e.nombreArrives
            // if( e.capacitesAccueil && e.capacitesAccueil.nombreChambes ) object.nombreChambes = e.capacitesAccueil.nombreChambes
            // if( e.capacitesAccueil && e.capacitesAccueil.nombreChambesDisponibles ) object.nombreChambesDisponibles = e.capacitesAccueil.nombreChambesDisponibles

            result["options"].push(object);
            return e;
          });

          result.total = {};
          result.total.total = result.options.length;
          result.total.dureeSejour = totalDureeSejour;
          if (result.options.length > 0)
            result.total.moyenneDureeSejour =
              totalDureeSejour / result.options.length;
          result.total.totalEntreeFrontiere = totalEntreeFrontiere;
          result.total.totalSortieFrontiere = totalSortieFrontiere;

          return h.response({ message: "Done", resources: result }).code(200);
        } catch (error) {
          return error.message;
        }
      },
      tags: ["api"],
    };
  }

  uploadFile() {
    return {
      description: "Route for upload file ",
      auth: false,
      handler: async (request, h) => {
        try {
          const filePath = storeDir + request.params.filename;
          try {
            fs.existsSync(filePath);
            return h.file(filePath);
            let fileFound = false;
            if (fs.existsSync(filePath)) {
              fileFound = true;
              return h.file(filePath);
            } else {
              setTimeout(() => {
                if (fs.existsSync(filePath)) {
                  return h.file(filePath);
                } else {
                  return h.response({ message: "File not found" }).code(400);
                }
              }, 2000);
            }
          } catch (error) {
            return h.response({ error }).code(400);
          }
        } catch (error) {
          return error.message;
        }
      },
      tags: ["api"],
    };
  }
  
  clearDatabase() {
    return {
      description: "Clear database",
      auth: false,
      validate: {
        // payload: this.validate.createMany,
        // failAction: (request, h, error) => {
        //   return h.response({ message: error.details[0].message.replace(/['"]+/g, '') }).code(400).takeover();
        // }
      },
      handler: async (request, h) => {
        try {
          const COLLECTIONS = [
            // 'admin',
            "formaeroportentree",
            "formaeroportsortie",
            "formclienthotel",
            "formfrontiereentreevoyageur",
            "formfrontieresortievoyageur",
            "formstatagence",
            "formstatculture",
            "formstathotel",
            "formstatlocationvehiculesansop",
            "formstatrestau",
            "formstatsport",
            "formstattransport",
            "formtourismeemetteur",
            "formtourismeinterne",
            "formtourismerecepteur",
            "inscription",
            // 'permission',
            // 'role',
            // 'secteur',
            // 'typeetablissement',
          ];

          // COLLECTIONS.forEach(async collection => {
          //   let response = await MainHelper[collection].removeAll();
          // });

          // register admin
          const ADMIN = {
            email: "admin@gmail.com",
            password: "Admin@1234",
            firstname: "Admin",
            lastname: "Admin",
            role: "63ce906e0950ce0028cc4a0d",
            isConfirmEmail: true,
          };
          let registerResponse = await MainHelper["admin"].register(ADMIN);

          return h.response({ message: "Action effectuée" }).code(200);
        } catch (error) {
          return error.message;
        }
      },
      tags: ["api"],
    };
  }
  // utils --------------------------------------------------------------------------------------------
  async exportStatFromTableByField(table, fields) {
    let fieldsValues = [];
    try {
      for (let i = 0; i < fields.length; i++) {
        let values = await MainHelper[table].fieldValues(fields[i]);
        fieldsValues.push({ field: fields[i], values: values });
      }
    } catch (error) {
      console.log("error: ", error);
      return h.response({ message: error }).code(400);
    }
    //populate when fiel is an objectId type
    for (let j = 0; j < fieldsValues.length; j++) {
      if (fieldsValues[j].field == "typeEtablissement") {
        fieldsValues[j].valuesObjects = [];
        for (let k = 0; k < fieldsValues[j].values.length; k++) {
          let data = null;
          if (fieldsValues[j].field == "typeEtablissement") {
            data = await MainHelper["typeetablissement"].get(
              fieldsValues[j].values[k]
            );
          }
          fieldsValues[j].valuesObjects.push(data);
        }
      }
    }
    for (let i = 0; i < fieldsValues.length; i++) {
      fieldsValues[i].resources = [];
      fieldsValues[i].resourcesCount = [];
      for (let j = 0; j < fieldsValues[i].values.length; j++) {
        let result = await MainHelper[table].list({
          [fieldsValues[i].field]: fieldsValues[i].values[j],
        });
        fieldsValues[i].resources.push(result);
        fieldsValues[i].resourcesCount.push(result.length);
      }
    }

    return fieldsValues;
  }
};
