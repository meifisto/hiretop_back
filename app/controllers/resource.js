"use strict";
const MainHelper = require("../helpers");
const UtilHelper = require("../helpers/utils");
const CloudinaryHelper = require("../helpers/cloudinary");
const AttributsRemover = require("../helpers/attributsRemover");
const Destructuror = require("../helpers/destructuror");
// const Control_access = require("../helpers/control_access");
const QRCode = require("qrcode");
const endOfDay = require("date-fns/endOfDay");
const startOfDay = require("date-fns/startOfDay");
const cloudinary = require("cloudinary").v2;
var short = require("short-uuid");

const storeDir = require("../helpers/storagepath").filesStoragePath;
const exportDir = process.env.EXPORT_DIR;
const tmpDir = process.env.TMP_DIR;

const json2xlsx = require("node-json-xlsx");
const fs = require("fs");

const axios = require("axios");
// recaptch v3
const secretKey = "6Lc2dtApAAAAAPO5q7VW8aOR-nlRu0IQshCneRYq";

const Queue = require("../helpers/queue");
const queue = Queue.queue;

// const {LocalStorage} = require("node-localstorage");
// let localStorage = new LocalStorage('./scratch');
// const userCredentials = JSON.parse(localStorage.getItem('authCredentials'))

module.exports = class ResourceController {
  constructor(type, plural, validate) {
    this.type = type;
    this.plural = plural;
    this.validate = validate;
  }

  get() {
    return {
      description: "Returns the " + this.type + " info",
      auth: false,
      handler: async (request, h) => {
        try {
          const userCredentials = request.auth.credentials;
          // if (this.type === "inscription") {
          //   // promo_etablissement, agent_etablissement can't load an establishment data
          //   if (
          //     userCredentials &&
          //     (userCredentials.role === "promo_etablissement" ||
          //       userCredentials.role === "agent_etablissement")
          //   ) {
          //     if (userCredentials.etablissementId !== request.params.resource) {
          //       return h
          //         .response({
          //           message: `Vous n'avez pas la permission d'accéder à cette ressource`,
          //         })
          //         .code(401);
          //     }
          //   }
          // }

          // if (userCredentials) {
          //   const Control_access_result = await Control_access.can_access(
          //     userCredentials,
          //     this.type,
          //     "object",
          //     request.params.resource
          //   );
          //   if (!Control_access_result)
          //     return h
          //       .response({
          //         message: `Vous n'avez pas la permission d'accéder à cette ressource`,
          //       })
          //       .code(401);
          // }

          let data = null;
          try {
            data = await MainHelper[this.type].get(request.params.resource);
          } catch (error) {
            return h.response({ message: "Mauvais paramètre" }).code(400);
          }
          return h
            .response(data ? { ["resource"]: data } : { message: "Ressource Introuvable" })
            .code(data ? 200 : 400);
        } catch (error) {
          return error.message;
        }
      },
      tags: ["api"],
    };
  }

  count() {
    return {
      description: "Returns the count of " + this.plural,
      auth: "jwt",
      handler: async (request, h) => {
        try {
          if (request.query.createdAt) {
            request.query.createdAt = JSON.parse(request.query.createdAt);
          }

          return h
            .response({
              [this.plural]: await MainHelper[this.type].count(request.query),
            })
            .code(200);
        } catch (error) {
          return error.message;
        }
      },
      tags: ["api"],
    };
  }

  listAll() {
    return {
      description: "Returns the list of " + this.total,
      auth: false,
      handler: async (request, h) => {
        try {
          console.log('request::: ', request);
          let query = request.query.options
            ? JSON.parse(request.query.options)
            : {};
          let filter = {};
          let sort = {};

          if (request.query.filter) {
            const filterData = JSON.parse(request.query.filter);
            if (filterData.text) {
              filter = { $or: [] };

              filterData.type.forEach((type) => {
                filter["$or"].push({
                  [type]: new RegExp(filterData.text, "gi"),
                });
              });
            }
          }

          if (request.query.sort) {
            let sortData = JSON.parse(request.query.sort);
            for (var p in sortData) {
              if (sortData[p] !== 0) {
                sort[p] = sortData[p];
              }
            }
          }

          const params = {
            ...query,
            ...filter,
          };

          const page = request.query.page ? parseInt(request.query.page) : 0;
          // const perPage = request.query.perPage ? parseInt(request.query.perPage) : 30;
          const perPage = request.query.perPage

          let resources = await MainHelper[this.type].list(
            params,
            page,
            perPage,
            sort
          );
          let resourceCount = await MainHelper[this.type].count(params);

          return h
            .response({
              [this.plural]: resources,
              total: resourceCount,
            })
            .code(200);
        } catch (error) {
          return error.message;
        }
      },
      tags: ["api"],
    };
  }

  list() {
    // auth: this.type == "sector" ? false : "jwt",
    // auth: false,
    return {
      description: "Returns the list of " + this.total,
      auth: this.type == "sector" ? false : "jwt",
      handler: async (request, h) => {
        try {
          console.log('::: --------------------------------', );
          console.log('request.query::: ', request.query);
          console.log('request.payload::: ', request.payload);
          let query = request.query.options
            ? JSON.parse(request.query.options)
            : {};
          let filter = {};
          let sort = {};
          if (request.query.filter) {
            const filterData = JSON.parse(request.query.filter);
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
          }
          if (request.query.sort) {
            let sortData = JSON.parse(request.query.sort);
            for (var p in sortData) {
              if (sortData[p] !== 0) {
                sort[p] = sortData[p];
              }
            }
          }
          const params = { ...query, ...filter };
          const page = request.query.page ? parseInt(request.query.page) : 0;
          const perPage = request.query.perPage ? parseInt(request.query.perPage) : 1000000;
          // const perPage = request.query.perPage

          console.log('params::: ', params);
          let resources = await MainHelper[this.type].list(
            params,
            page,
            perPage,
            sort
          );
          console.log('resources.length::: 🟢', resources.length);
          // console.log('resources.length::: 1', resources.length);

          // remove unable attributs
          let result = await AttributsRemover.cleanArray(resources, []);
          if (result.status) resources = result.resources;

          // console.log('resources.length::: 2', resources.length);


          let resourceCount = await MainHelper[this.type].count(params);

          // for model 'roles' : remove permissions
          if (this.type === "role" && !request.query.load_permissions) {
            resources.forEach((resource) => {
              delete resource.permissions;
            });
          }

          // console.log('resources.length::: 3', resources.length);
          // console.log('resources.length::: ⭕️', resources.length > 0 && resources[0]);

          // console.log('resources.length::: 4', resources.length);

          return h
            .response({
              resources: resources.reverse(),
              total: resourceCount,
            })
            .code(200);
        } catch (error) {
          return error.message;
        }
      },
      tags: ["api"],
    };
  }

  create() {
    return {
      description: "Create a new " + this.type,
      // auth: formsPublics.includes(this.type) ? false : "jwt",
      auth: false,
      validate: {
        payload: this.validate.create,
        failAction: (request, h, error) => {
          return h
            .response({message: error.details[0].message.replace(/['"]+/g, "")})
            .code(400)
            .takeover();
        },
      },
      handler: async (request, h) => {
        try {
          // console.log('this.type::: ', this.type);
          let data = await MainHelper[this.type].create({ ...request.payload });
          // console.log('create form data::: ', data);
          return h
            .response({ message: data.message, resource: data.resource })
            .code(data.statusCode);
        } catch (error) {
          return error.message;
        }
      },
      tags: ["api"],
    };
  }

  createWithFile() {
    return {
      description: "Create a new " + this.type,
      auth: this.type == "businessprofil" || "talentprofil" ? false : "jwt",
      payload: {
        output: "stream",
        allow: "multipart/form-data", // important,
        maxBytes: 10 * 1024 * 1024,
      },
      validate: {
        payload: this.validate.createWithFile,
        failAction: (request, h, error) => {
          return h
            .response({
              message: error.details[0].message.replace(/['"]+/g, ""),
            })
            .code(400)
            .takeover();
        },
      },
      handler: async (request, h) => {
        try {
          // check token validity
          let resultChecking = null;
          const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${request.payload.token}`;
          await axios
            .post(verifyUrl, {})
            .then((response) => {
              resultChecking = response.data;
            })
            .catch((error) => {
              resultChecking = error;
            });
          // treatment     
          // if(resultChecking.success){
          if(true){
            // console.log('request.payload::: ', Object.keys(request.payload));
            let dataRaw = JSON.parse(request.payload.objectdata);
            
            //create tmp directory if not exist
            if (!fs.existsSync(storeDir) && request.payload.filenumber > 0) {
              fs.mkdirSync(storeDir, { recursive: true });
            }
            //upload files
            dataRaw[request.payload.fileprop] = [];
            for (var i = 0; i < parseInt(request.payload.filenumber); i++) {
              if (request.payload["filedata" + i] && request.payload["filedata" + i] != "null") {
                // upload on cloudinary
                const file_upload_in_cloudinary = await CloudinaryHelper.uploadFile(request.payload['filedata' + i]);
                if(file_upload_in_cloudinary.result) dataRaw[request.payload.fileprop].push(file_upload_in_cloudinary.result);
                else dataRaw[request.payload.fileprop].push(null)
                
                // create file in disk
                // const words = request.payload["filedata" + i].hapi.filename.split(".");
                // const fileName = short.generate().slice(0, 3) + words[0] + short.generate().slice(0, 7) + "." + words[words.length - 1];
                // console.log('fileName::: ', fileName);
                // fs.createWriteStream(storeDir + fileName).write( request.payload["filedata" + i]._data );
                // dataRaw[request.payload.fileprop].push(fileName);
              } else {
                console.log("no file");
              }
            }

            // register in base
            // console.log('this.type::: ', this.type);
            let newCreation = await MainHelper[this.type].create(dataRaw);
            // console.log('newCreation::: ', newCreation);
  
            // return h.response({ message: "Role introuvable" }).code(400);
            if (newCreation) {
              if (this.type == "businessprofil" || this.type == "talentprofil") {
                // load role admin etablissemnt
                let params_role_code = this.type == "businessprofil" ? "business" : "talent"
                let roleBusinessOrTalent = await MainHelper["role"].list({ code: params_role_code }, null, null, { createdAt: 1 });
                if (!roleBusinessOrTalent || roleBusinessOrTalent.length === 0) return h.response({ message: "Role introuvable" }).code(400);
                roleBusinessOrTalent = roleBusinessOrTalent[0];

                // register associated user
                let data = {}
                if(this.type === "businessprofil"){
                  data = {
                    email: newCreation.resource.email,
                    telephone: newCreation.resource.legal_representant_phonenumber,
                    firstname: newCreation.resource.legal_representant_fistname,
                    lastname: newCreation.resource.legal_representant_lastname,
  
                    password: dataRaw.password,
                    role: roleBusinessOrTalent._id,
                    code: short.generate().slice(0, 7),
                  }
                }
                if(this.type === "talentprofil"){
                  data = {
                    email: dataRaw.email,
                    telephone: dataRaw.telephone,
                    firstname: dataRaw.firstname,
                    lastname: dataRaw.lastname,
                    fichiers: [dataRaw.fichiers[1]],
                    password: dataRaw.password,
                    role: roleBusinessOrTalent._id,
                    code: short.generate().slice(0, 7),
                  }
                }

                this.type == "businessprofil" ? data.business_associated = newCreation.resource._id : data.talent_associated = newCreation.resource._id

                let newUser = await MainHelper["user"].register(data);
                if(newUser){
                  let objectUpdateModelWithUser = await MainHelper[this.type].update(newCreation.resource._id, {user : newUser.user._id });
                }

                if(newUser){
                  return h.response({ message: newUser.message }).code(newUser.statusCode);
                }
              } else {
                return h
                  .response({
                    message: "Enrégistrement effectué",
                    resource: newCreation,
                  })
                  .code(200);
              }
            } 
            return h.response({ message: "Echec de l'enregistrement" }).code(400);
          }
        } catch (error) {
          return error.message;
        }
      },
      tags: ["api"],
    };
  }

  createMany() {
    return {
      description: "Create a new set of " + this.type,
      auth: "jwt",
      validate: {
        payload: this.validate.createMany,
        failAction: (request, h, error) => {
          return h
            .response({
              message: error.details[0].message.replace(/['"]+/g, ""),
            })
            .code(400)
            .takeover();
        },
      },
      handler: async (request, h) => {
        try {
          let data = await MainHelper[this.type].createMany(request.payload);
          return h
            .response({ message: data.message, resources: data.resources })
            .code(data.statusCode);
        } catch (error) {
          return error.message;
        }
      },
      tags: ["api"],
    };
  }

  update() {
    return {
      description: "Remove the " + this.type,
      auth: false,
      validate: {
        payload: this.validate.update,
        failAction: (request, h, error) => {
          return h
            .response({
              message: error.details[0].message.replace(/['"]+/g, ""),
            })
            .code(400)
            .takeover();
        },
      },
      handler: async (request, h) => {
        try {
          // const authCredentials = request.auth.credentials;
          let editor = request.payload.editor;
          delete request.payload["editor"];
          let objectUpdate = await MainHelper[this.type].update(
            request.params.resource,
            request.payload
          );
          return h
            .response({ message: "Done", resource: objectUpdate.resource })
            .code(200);
        } catch (error) {
          return error.message;
        }
      },
      tags: ["api"],
    };
  }

  updateWithFile() {
    return {
      description: "Update the " + this.type,
      auth: "jwt",
      payload: {
        output: "stream",
        allow: "multipart/form-data", // important,
        maxBytes: 10 * 1024 * 1024,
      },
      validate: {
        payload: this.validate.updateWithFile,
        failAction: (request, h, error) => {
          return h
            .response({
              message: error.details[0].message.replace(/['"]+/g, ""),
            })
            .code(400)
            .takeover();
        },
      },
      handler: async (request, h) => {
        try {
          // check token validity
          let resultChecking = null;
          const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${request.payload.token}`;
          await axios
            .post(verifyUrl, {})
            .then((response) => {
              resultChecking = response.data;
            })
            .catch((error) => {
              resultChecking = error;
            });
          // treatment     
          if(resultChecking.success){
            let dataRaw = JSON.parse(request.payload.objectdata);
            // console.log('dataRaw::: ', dataRaw);
            
            //create tmp directory if not exist
            if (!fs.existsSync(storeDir) && request.payload.filenumber > 0) {
              fs.mkdirSync(storeDir, { recursive: true });
            }

            //upload files
            dataRaw[request.payload.fileprop] = [];
            for (var i = 0; i < parseInt(request.payload.filenumber); i++) {
              if (request.payload["filedata" + i] && request.payload["filedata" + i] != "null") {
                // upload on cloudinary
                const file_upload_in_cloudinary = await CloudinaryHelper.uploadFile(request.payload['filedata' + i]);
                if(file_upload_in_cloudinary.result) dataRaw[request.payload.fileprop].push(file_upload_in_cloudinary.result);
                else dataRaw[request.payload.fileprop].push(null)
              } else {
                console.log("no file");
              }
            }


            // update in base
            let newUpdate = await MainHelper[this.type].update(
              request.params.resource,
              dataRaw
            );
            // return h.response({ message: 'Toto' }).code(400);
            if(newUpdate){
              if (this.type == "businessprofil" || this.type == "talentprofil") {
                // load role admin etablissemnt
                let params_role_code = this.type == "businessprofil" ? "business" : "talent"
                let roleBusinessOrTalent = await MainHelper["role"].list({ code: params_role_code }, null, null, { createdAt: 1 });
                if (!roleBusinessOrTalent || roleBusinessOrTalent.length === 0)
                  return h
                    .response({ message: "Role introuvable" })
                    .code(400);
                roleBusinessOrTalent = roleBusinessOrTalent[0];
                console.log('roleBusinessOrTalent::: ', roleBusinessOrTalent);
                // register associated user
                let data = {}
                if(this.type === "businessprofil"){
                  data = {
                    // email: newCreation.resource.email,
                    telephone: newCreation.resource.legal_representant_phonenumber,
                    firstname: newCreation.resource.legal_representant_fistname,
                    lastname: newCreation.resource.legal_representant_lastname,
  
                    password: dataRaw.password,
                    role: roleBusinessOrTalent._id,
                    // code: short.generate().slice(0, 7),
                  }
                }
                if(this.type === "talentprofil"){
                  data = {
                    // email: dataRaw.email,
                    telephone: dataRaw.telephone,
                    firstname: dataRaw.firstname,
                    lastname: dataRaw.lastname,
                    fichiers: [dataRaw.fichiers[1]],
                    // password: dataRaw.password,
                    // role: roleBusinessOrTalent._id,
                    // code: short.generate().slice(0, 7),
                  }
                }

                this.type == "businessprofil" ? data.business_associated = newCreation.resource._id : data.talent_associated = newCreation.resource._id

                let newUser = await MainHelper["user"].register(data);
                if(newUser){
                  return h.response({ message: newUser.message }).code(newUser.statusCode);
                }
              } else {
                return h
                  .response({
                    message: "Enrégistrement effectué",
                    resource: newCreation,
                  })
                  .code(200);
              }
            }
          }

          let dataRaw = JSON.parse(request.payload.objectdata);
          delete dataRaw.objectid;
          //create tmp directory if not exist
          if (!fs.existsSync(storeDir) && request.payload.filenumber > 0) {
            fs.mkdirSync(storeDir, { recursive: true });
          }

          //upload files
          dataRaw[request.payload.fileprop] = [];
          for (var i = 0; i < parseInt(request.payload.filenumber); i++) {
            if (request.payload["filedata" + i] && request.payload["filedata" + i] != "null") {
              // upload on cloudinary
              const file_upload_in_cloudinary = await CloudinaryHelper.uploadFile(request.payload['filedata' + i]);
              if(file_upload_in_cloudinary.result) dataRaw[request.payload.fileprop].push(file_upload_in_cloudinary.result);
              else dataRaw[request.payload.fileprop].push(null)
            } else {
              console.log("no file");
            }
          }

          let newUpdate = await MainHelper[this.type].update(
            request.params.resource,
            dataRaw
          );

          if (newUpdate) {
            return h
              .response({
                message: "Mise à jour effectuée",
                resource: newUpdate,
              })
              .code(200);
          }
          return h.response({ message: "Done" }).code(200);
        } catch (error) {
          return error.message;
        }
      },
      tags: ["api"],
    };
  }

  createOrUpdate() {
    return {
      description: "Create a new set of " + this.type,
      auth: "jwt",
      validate: {
        payload: this.validate.createOrUpdate,
        failAction: (request, h, error) => {
          return h
            .response({
              message: error.details[0].message.replace(/['"]+/g, ""),
            })
            .code(400)
            .takeover();
        },
      },
      handler: async (request, h) => {
        try {
          let data = await MainHelper[this.type].createOrUpdate(
            request.payload.data,
            request.payload.filter
          );
          return h
            .response({ message: data.message, resources: data.resources })
            .code(data.statusCode);
        } catch (error) {
          console.log(error);
          return error.message;
        }
      },
      tags: ["api"],
    };
  }



  import() {
    return {
      description: "Create a new " + this.type,
      auth: "jwt",
      payload: {
        output: "stream",
        allow: "multipart/form-data", // important
      },
      validate: {
        payload: this.validate.import,
        failAction: (request, h, error) => {
          return h
            .response({
              message: error.details[0].message.replace(/['"]+/g, ""),
            })
            .code(400)
            .takeover();
        },
      },
      handler: async (request, h) => {
        try {
          let data = UtilHelper.parseExcel(request.payload.file._data);
          const values = await this.validate.importData(
            data,
            request.payload.ecole
          );
          return await MainHelper[this.type].createOrUpdate(values);
        } catch (error) {
          return error.message;
        }
      },
      tags: ["api"],
    };
  }

  export() {
    return {
      description: "Returns the list of " + this.total,
      auth: "jwt",
      handler: async (request, h) => {
        try {
          let query = request.query.options
            ? JSON.parse(request.query.options)
            : {};
          let filter = {};
          let sort = {};

          if (request.query.filter) {
            const filterData = JSON.parse(request.query.filter);
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
          }


          if (request.query.sort) {
            let sortData = JSON.parse(request.query.sort);
            for (var p in sortData) {
              if (sortData[p] !== 0) {
                sort[p] = sortData[p];
              }
            }
          }
          const params = {
            ...query,
            ...filter,
          };

          const page = request.query.page ? parseInt(request.query.page) : 0;
          // const perPage = request.query.perPage ? parseInt(request.query.perPage) : 1000000000000000;
          const perPage = request.query.perPage
          try {
            let resources = await MainHelper[this.type].listforexport(
              params,
              page,
              perPage,
              sort
            );

            // refactoring : object to string 
            const objects_array = {
              commissariat : ['nom', '_id'],
              auteur : ['firstname', 'lastname', '_id'],
            }
            const objects_array_list = Object.keys(objects_array)
            resources.forEach(resource => {
              objects_array_list.forEach(attr => {
                if (resource.hasOwnProperty(attr)) {
                  // console.log(`Traitement sur --- ${attr} --- , valeur: ${ JSON.stringify(resource[attr])}`);
                  let new_attribut_value = ''
                  for (let index = 0; index < objects_array[attr].length; index++) {
                    const sub_attribut = objects_array[attr][index];
                    new_attribut_value += `${resource[attr][sub_attribut]} `
                  }
                  resource[attr] = new_attribut_value
                }
              });
            });
            
            // refactoring : object to string 
            // build destructuration
            let result = await Destructuror.breakObjects(resources);
            if (result.status) resources = result.resources;

            // prepare export
            try {
              // create excel
              let tableInfos = await this.validate.exportData();
              var xlsx = json2xlsx(resources, {
                fields: tableInfos.columns,
                fieldNames: tableInfos.designation
                  ? tableInfos.designation
                  : tableInfos.columns,
              });

              //create tmp directory if not exist
              if (!fs.existsSync(exportDir)) {
                fs.mkdirSync(exportDir, { recursive: true });
              }
              // create file
              try {
                fs.writeFileSync(
                  exportDir + tableInfos.name + ".xlsx",
                  xlsx,
                  "binary"
                );
              } catch (error) {
                console.log("error: ", error);
              }
              return h.file(exportDir + tableInfos.name + ".xlsx");
            } catch (error) {
              console.log(error);
            }
          } catch (error) {
            console.log("error: ", error);
            return h.response({ message: error }).code(400);
          }
        } catch (error) {
          return error.message;
        }
      },
      tags: ["api"],
    };
  }

  remove() {
    return {
      description: "Remove the " + this.type,
      auth: "jwt",
      validate: {
        payload: this.validate.remove,
        failAction: (request, h, error) => {
          return h
            .response({
              message: error.details[0].message.replace(/['"]+/g, ""),
            })
            .code(400)
            .takeover();
        },
      },
      handler: async (request, h) => {
        try {
          //remove resource
          let result = await MainHelper[this.type].remove(request.payload.id);
          return h.response({ message: "Done" }).code(200);
        } catch (error) {
          return error.message;
        }
      },
      tags: ["api"],
    };
  }

  removeMany() {
    return {
      description: "Remove the " + this.type,
      auth: "jwt",
      validate: {
        payload: this.validate.removeMany,
        failAction: (request, h, error) => {
          return h
            .response({
              message: error.details[0].message.replace(/['"]+/g, ""),
            })
            .code(400)
            .takeover();
        },
      },
      handler: async (request, h) => {
        try {
          let removes = await MainHelper[this.type].removeMany(
            request.payload.id
          );
          return h.response({ message: "Done" }).code(200);
        } catch (error) {
          return error.message;
        }
      },
      tags: ["api"],
    };
  }

  removeAll() {
    return {
      description: "Remove all " + this.type,
      auth: "jwt",
      handler: async (request, h, error) => {
        try {
          let remove = await MainHelper[this.type].removeAll();
          return h.response({ message: "Done" }).code(200);
        } catch (error) {
          return error.message;
        }
      },
      tags: ["api"],
    };
  }

  uploadCloudinary() {
    return {
      description: "Upload files in cloudinary " + this.type,
      auth: "jwt",
      payload: {
        output: "stream",
        allow: "multipart/form-data",
        maxBytes: 10 * 1024 * 1024,
      },
      handler: async (request, h) => {
        try {
          if (!request.payload.filenumber)
            return h.response({ message: "mauvais paramètres 2" }).code(400);
          const fs = require("fs");
          let files = [];
          //cloudinary config
          cloudinary.config({
            cloud_name: "dfidd0bty",
            api_key: "778917222714153",
            api_secret: "Ycc89YnBN4XaM3tkdkIzpLU3gOw",
          });
          //create tmp directory if not exist
          // const tmpDir = "files/tmp/"
          if (!fs.existsSync(tmpDir)) {
            fs.mktmpDirSync(tmpDir, { recursive: true });
          }
          for (var i = 0; i < parseInt(request.payload.filenumber); i++) {
            if (
              !request.payload["filedata" + i] ||
              request.payload["filedata" + i] == "null"
            )
              return h.response({ message: "mauvais paramètres 3" }).code(400);
            if (
              request.payload["filedata" + i] &&
              request.payload["filedata" + i] != "null"
            ) {
              // create file in disk
              fs.createWriteStream(
                tmpDir + request.payload["filedata" + i].hapi.filename
              ).write(request.payload["filedata" + i]._data);
              //upload in cloudinary
              await cloudinary.uploader.upload(
                tmpDir + request.payload["filedata" + i].hapi.filename,
                (error, result) => {
                  if (result) {
                    files.push(result);
                    //remove file
                    try {
                      fs.unlinkSync(
                        tmpDir + request.payload["filedata" + i].hapi.filename
                      );
                    } catch (err) {
                      console.error(err);
                    }
                  }
                  if (error) {
                    console.log("error: ", error);
                    files.push(error);
                    //remove file
                    try {
                      fs.unlinkSync(
                        tmpDir + request.payload["filedata" + i].hapi.filename
                      );
                    } catch (err) {
                      console.error(err);
                    }
                  }
                }
              );
            } else {
              console.log("no file found: ", request.payload["filedata" + i]);
            }
          }
          return h
            .response({ message: "upload cloudinary success", files })
            .code(200);
        } catch (error) {
          return h.response({ message: error.message }).code(400);
        }
      },
      tags: ["api"],
    };
  }
};
