"use strict";
var JWT = require("jsonwebtoken");
const Config = require("../../config/config");
const MainHelper = require("../helpers");
const AttributsRemover = require("../helpers/attributsRemover");
const MailSender = require("../helpers/mailsender");
// const { da } = require('date-fns/locale');
var short = require("short-uuid");
const CloudinaryHelper = require("../helpers/cloudinary");

var _ = require("lodash");
const fs = require("fs");

const storeDir = require("../helpers/storagepath").filesStoragePath;
const tmpDir = process.env.TMP_DIR;

const exportDir = process.env.EXPORT_DIR;
const Queue = require("../helpers/queue");
const queue = Queue.queue;

const axios = require("axios");
// recaptch v3
const secretKey = "6Lc2dtApAAAAAPO5q7VW8aOR-nlRu0IQshCneRYq";

const { LocalStorage } = require("node-localstorage");
let localStorage = new LocalStorage("./scratch");

class UserUtils {
  constructor(user) {
    this.user = user;
  }
  get isAdmin() {
    // eslint-disable-next-line camelcase
    return this.userRole && this.userRole.code === "admin";
  }
  get isBusiness() {
    // eslint-disable-next-line camelcase
    return this.userRole && this.userRole.code === "business";
  }
  get isTalent() {
    // eslint-disable-next-line camelcase
    return this.userRole && this.userRole.code === "talent";
  }
  get businessId() {
    return this.user.business_associated && this.user.business_associated._id;
  }
  get talentId() {
    return this.user.talent_associated && this.user.talent_associated._id;
  }
  get userRole() {
    return (this.user && this.user.role) || null;
  }
  get userRoleId() {
    return (this.userRole && this.userRole._id) || null;
  }
}

module.exports = class UserController {
  constructor(type, plural, validate) {
    this.type = type;
    this.plural = plural;
    this.validate = validate;
  }

  getDetails() {
    return {
      description: "Returns the " + this.type + " info",
      auth: "jwt",
      handler: async (request, h) => {
        try {
          let admin = await MainHelper[this.type].findUserDetails(
            request.headers.userId
          );
          let result = await AttributsRemover.cleanArray([admin], ["code"]);
          return h.response({ resource: result.resources[0] }).code(200);
        } catch (error) {
          return error.message;
        }
      },
      tags: ["api"],
    };
  }

  get() {
    return {
      description: "Returns the " + this.type + " info",
      auth: "jwt",
      handler: async (request, h) => {
        try {
          const userCredentials = request.auth.credentials;
          // console.log("userCredentials::: ⭕️", userCredentials);
          if (
            userCredentials &&
            (userCredentials.role === "commissaire" ||
              userCredentials.role === "agent_police")
          ) {
            if (
              userCredentials.commissaireId !== request.params.user &&
              userCredentials.userId !== request.params.user
            ) {
              return h
                .response({
                  message: `Vous n'avez pas la permission d'accéder à cette ressource`,
                })
                .code(401);
            }
          }
          let admin = await MainHelper[this.type].get(request.params.user);
          // console.log("admin::: ⭕️", admin);
          if (!admin)
            return h.response({ message: "Mauvais paramètre" }).code(400);

          // controle role agent etab
          if (
            userCredentials &&
            userCredentials.role === "promo_etablissement"
          ) {
            if (
              String(admin.etablissement._id) !==
              String(userCredentials.etablissementId)
            ) {
              console.log("pas de matching ::: ⭕️");
              return h
                .response({
                  message: `Vous n'avez pas la permission d'accéder à cette ressource`,
                })
                .code(401);
            }
          }

          let formsResults = [];
          //populate fiches if user role is agent_etablissement
          if (admin.fiches && admin.fiches.length > 0) {
            for (let i = 0; i < admin.fiches.length; i++) {
              try {
                if (admin.fiches && admin.fiches.length > 0) {
                  if (admin.fiches[i].key && admin.fiches[i].id) {
                    let form = await MainHelper[admin.fiches[i].key].get(
                      admin.fiches[i].id
                    );

                    formsResults.push({
                      // _id: admin.fiches[i]._id,
                      id: admin.fiches[i].id,
                      key: admin.fiches[i].key,
                      data: form,
                    });
                  }
                }
              } catch (error) {
                console.log("error: ", error);
              }
            }
          }

          let result = await AttributsRemover.cleanArray([admin], ["code"]);
          // console.log("result::: ⭕️", result.resources[0]);

          return h
            .response({
              resource: result.resources[0],
              formsCreate: formsResults,
            })
            .code(200);
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

  list() {
    return {
      description: "Returns the list of " + this.total,
      auth: "jwt",
      handler: async (request, h) => {
        try {
          let query = request.query.options
            ? JSON.parse(request.query.options)
            : {};
          query.isArchive = false;
          let filter = {};
          let sort = {};

          if (request.query.filter) {
            const filterData = JSON.parse(request.query.filter);
            if (filterData.text) {
              filter = { $or: [] };
              filterData.type.forEach((type) => {
                if (type == "role" || type == "etablissement") {
                  filter["$or"].push({ [type]: filterData.text[0] });
                } else {
                  filter["$or"].push({
                    [type]: new RegExp(filterData.text, "gi"),
                  });
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
          const perPage = request.query.perPage
            ? parseInt(request.query.perPage)
            : 30;

          let users = await MainHelper[this.type].list(
            params,
            page,
            perPage,
            sort
          );

          // remove unable attributs
          let result = await AttributsRemover.cleanArray(users, ["code"]);
          if (result.status) users = result.resources;

          // users.reverse()
          let userCount = await MainHelper[this.type].count(params);
          return h
            .response({
              resources: users.reverse(),
              total: userCount,
            })
            .code(200);
        } catch (error) {
          return error.message;
        }
      },
      tags: ["api"],
    };
  }

  register() {
    return {
      description: "Create a new " + this.type,
      auth: false,
      validate: {
        payload: this.validate.register,
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
          if (request.payload.email !== request.payload.email.toLowerCase()) {
            return h.response({ message: "Les adresses emails doivent ëtre en miniscule" }).code(400);
          }
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
          // if (resultChecking.success) {
          if(true){
            // reject if may be a bot
            // if (resultChecking.score < 0.5)
            //   return h
            //     .response({ message: "Vous pouriez être un robot !!!" })
            //     .code(400);

            // load correct role
            const roles_codes = [
              "admin",
              "talent",
              "business",
            ];
            if (roles_codes.includes(request.payload.role)) { // control and add role to payload
              let curr_role = await MainHelper["role"].list(
                { code: request.payload.role },
                null,
                null,
                { createdAt: 1 }
              );
              if (!curr_role || !curr_role[0]._id)
                return h
                  .response({ message: "Role Associé introuvable" })
                  .code(400);
              curr_role = curr_role[0];
              request.payload.role = curr_role;
            }

            // traitment
            request.payload.code = short.generate().slice(0, 32);
            let data = await MainHelper[this.type].register({
              ...request.payload,
            });
            if (data.statusCode === 409)
              return h.response({ message: data.message }).code(400);
            // if (data) {
            //   // update agregat
            //   // let updateAgregat = await MainHelper["agregat"].updateOne(
            //   //   { table: "user" },
            //   //   { $inc: { count: 1 } },
            //   //   { upsert: true }
            //   // );

            //   // send mail for account validation
            //   // queue.push(
            //   //   {
            //   //     action: "sendMail",
            //   //     data: {
            //   //       receiver: data.user.email,
            //   //       receiverFullname: data.user.email,
            //   //       subject: "Confirmation Email",
            //   //       text: null,
            //   //       // htmlText:'Bienvenu <br> Cliquez sur "Continuez" pour valider votre email',
            //   //       htmlText:
            //   //         'Bienvenu <br> Cliquez sur "Continuez" pour valider votre email. <br><br> <a href="' +
            //   //         "siges-tourisme.gouv.bj/verify-email?email=" +
            //   //         data.user.email +
            //   //         "&code=" +
            //   //         data.user.code +
            //   //         "&r=" +
            //   //         '">Cliquez pour valider</a>',
            //   //       buttonText: "Continuez",
            //   //       buttonLink:
            //   //         "siges-tourisme.gouv.bj/verify-email?email=" +
            //   //         data.user.email +
            //   //         "&code=" +
            //   //         data.user.code,
            //   //       attachedFile: null,
            //   //       attachedFileName: null,
            //   //     },
            //   //   },
            //   //   (error, response) => {
            //   //     // console.log('response: ', response);
            //   //   }
            //   // );
            // }
            return h.response({ message: "Done" }).code(data.statusCode);
            // return h.response({ message: "Erreur " }).code(400);
          }
        } catch (error) {
          return error.message;
        }
      },
      tags: ["api"],
    };
  }

  registerWithFile() {
    return {
      description: "Create a new " + this.type,
      auth: false,
      payload: {
        output: "stream",
        allow: "multipart/form-data", // important,
        maxBytes: 10 * 1024 * 1024,
      },
      validate: {
        payload: this.validate.registerWithfile,
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
          let dataRaw = JSON.parse(request.payload.objectdata);
          if (
            dataRaw.emailEtablissement !== dataRaw.emailEtablissement.toLowerCase() || 
            dataRaw.emailPromoteur !== dataRaw.emailPromoteur.toLowerCase()
          ){
            return h.response({ message: "Les adresses emails doivent ëtre en miniscule." }).code(400);
          }
          dataRaw.code = short.generate().slice(0, 7);

          // control data
          if (!dataRaw.email || !dataRaw.role) return h.response({ message: "Mauvais paramètres" }).code(400);

          //upload files
          dataRaw[request.payload.fileprop] = [];
          for (var i = 0; i < parseInt(request.payload.filenumber); i++) {
            if (request.payload["filedata" + i] && request.payload["filedata" + i] != "null") {
              const file_upload_in_cloudinary = await CloudinaryHelper.uploadFile(request.payload['filedata' + i]);
              if(file_upload_in_cloudinary.result) dataRaw[request.payload.fileprop].push(file_upload_in_cloudinary.result);
              else dataRaw[request.payload.fileprop].push(null)
            } else {
              console.log("no file");
            }
          }

          // register in base
          let data = await MainHelper[this.type].register({ ...dataRaw });

          if (data.statusCode == 200)
            return h
              .response({ message: data.message, resource: data.user })
              .code(data.statusCode);
          else
            return h.response({ message: "Enregistrement échoué" }).code(400);
        } catch (error) {
          return error.message;
        }
      },
      tags: ["api"],
    };
  }

  login() {
    return {
      description: "Login to your account",
      auth: false,
      validate: {
        payload: this.validate.login,
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
          // return h
          //   .response({ message: "Test catching response" })
          //   .code(500); // reject if may be a bot
          const email_or_phone = request.payload[Object.keys(request.payload)[0]];
          const password = request.payload.password;

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
          // console.log('resultChecking::: ', resultChecking);
          if(true){
          // if (resultChecking.success) {
            // if (resultChecking.score < 0.5)
            //   return h
            //     .response({ message: "Vous pouriez être un robot !!!" })
            //     .code(400); // reject if may be a bot

            // current treatment ------------------------------------------------------------------------------
            let data = await MainHelper[this.type].findByCredentials(
              email_or_phone,
              password
            );

            if (data.statusCode === 200) {
              // if (!data.user.isConfirmEmail) {
              //   return h
              //     .response({
              //       message:
              //         "Cette adresse email n'est pas encore confirmée. Veuillez ouvrir votre boite mail pour la confirmation.",
              //     })
              //     .code(400);
              // }


              let secret = Config.get("/jwtAuthOptions/key");
              const userUtils = new UserUtils(data.user);

              let obj = {
                userId: data.user.id,
                role: (data.user && data.user.role && data.user.role.code) || null,
                ...(userUtils.isBusiness && {businessId: userUtils.businessId}),
                ...(userUtils.isTalent && {talentId: userUtils.talentId}),
              };
              // console.log('obj for jwt ::: ', obj);

              let jwtToken = JWT.sign(obj, secret, { expiresIn: "7 days" });
              // let jwtToken = JWT.sign(obj, secret, { expiresIn: '120s' });

              data.user.password = undefined;
              data.user.salt = undefined;
              //load role & permissions
              let userRole = await MainHelper["role"].get(data.user.role._id);
              // console.log('userRole::: ', userRole);
              if (userRole) {
                data.user.role = userRole;
                userRole = JSON.parse(JSON.stringify(userRole));
              }
              let result = await AttributsRemover.cleanArray(
                [data.user],
                ["code"]
              );
              let response = h
                .response({
                  message: "Successfully login",
                  [this.type]: result.resources[0],
                  token: jwtToken,
                })
                .code(200);
              response.header("Authorization", jwtToken);
              return response;
            } else {
              return h
                .response({ message: data.message })
                .code(data.statusCode);
            }
            // end current treatment ------------------------------------------------------------------------------
          } else {
            return h
              .response({
                message: "Erreur de validations de vos identifiants",
              })
              .code(400);
          }
        } catch (error) {
          return error.message;
        }
      },
      tags: ["api"],
    };
  }

  forgetPassword() {
    return {
      description: "Forget your password",
      auth: false,
      validate: {
        payload: this.validate.forgetPassword,
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
          // check mail validity
          let data = await MainHelper[this.type].findByEmail(
            request.payload.email
          );
          if (data.statusCode === 200) {
            //generate current code
            let currentCode = (this.reference = short.generate().slice(0, 7));
            //update user code
            let updateUser = await MainHelper[this.type].update(data.user.id, {
              code: currentCode,
              isResetPassord: true,
            });
            if (updateUser) {
              //sending mail
              queue.push(
                {
                  action: "sendMail",
                  data: {
                    receiver: request.payload.email,
                    receiverFullname: request.payload.email,
                    subject: "Réinitialisation de MDP",
                    text: null,
                    htmlText:
                      'Bonjour <br> Vous avez reçu ce mail pour réinitialiser votre MDP <br> Cliquez sur "Continuez" pour valider votre email et définir un nouveau mot de passe. <br><br> <a href="' +
                      "siges-tourisme.gouv.bj/verify-email?email=" +
                      request.payload.email +
                      "&code=" +
                      currentCode +
                      "&r=" +
                      '">Cliquez pour valider</a>',
                    buttonText: "Continuez",
                    buttonLink:
                      "siges-tourisme.gouv.bj/verify-email?email=" +
                      request.payload.email +
                      "&code=" +
                      currentCode +
                      "&r=",
                    attachedFile: null,
                    attachedFileName: null,
                  },
                },
                (error, response) => {
                  // console.log('response: ', response);
                }
              );
              return h
                .response({ message: "Identifiant correct, Mail envoyé" })
                .code(200);
            } else {
              return h.response({ message: "Erreur interne" }).code(500);
            }
          } else {
            return h.response({ message: data.message }).code(data.statusCode);
          }
        } catch (error) {
          return error.message;
        }
      },
      tags: ["api"],
    };
  }

  checkResetCode() {
    return {
      description: "Check your reset code",
      auth: false,
      validate: {
        payload: this.validate.checkResetCode,
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
          // check if have correct user
          let data = await MainHelper[this.type].list(request.payload);
          if (data.length == 1) {
            return h
              .response({ message: "Code valide", user: data[0] })
              .code(200);
          } else {
            return h.response({ message: "Code invalide" }).code(400);
          }
        } catch (error) {
          return error.message;
        }
      },
      tags: ["api"],
    };
  }

  resetPassword() {
    return {
      description: "Reset your password (by id)" + this.type,
      auth: false,
      validate: {
        payload: this.validate.resetPassword,
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
          let data = await MainHelper[this.type].update(request.params.user, {
            ...request.payload,
            code: "",
          });
          return h
            .response({ message: "Done", [this.type]: data.user })
            .code(200);
        } catch (error) {
          return error.message;
        }
      },
      tags: ["api"],
    };
  }

  setPassword() {
    return {
      description: "Set your password (by email)" + this.type,
      auth: false,
      validate: {
        payload: this.validate.setPassword,
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
          console.log('request.payload::: ', request.payload);
          //load user
          let user = await MainHelper[this.type].list({
            email: request.payload.email,
          });
          if (user.length === 1) {
            user = user[0];
            let updateUser = await MainHelper[this.type].update(user._id, {
              password: request.payload.password,
            });
            if (updateUser) {
              return h
                .response({
                  message: "Utilisateur trouvé, Mot de passe mis à jour",
                })
                .code(400);
            } else return h.response({ message: "Mise à jour du mot de passe échouée" }).code(400);
          } 
          return h.response({ message: "Utilisateur introuvable" }).code(400);
        } catch (error) {
          return error.message;
        }
      },
      tags: ["api"],
    };
  }

  confirmEmail() {
    return {
      description: "Confirm your email",
      auth: false,
      validate: {
        payload: this.validate.confirmEmail,
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
          // check if have correct user
          let currentUser = await MainHelper[this.type].list(request.payload);
          if (currentUser.length === 1) {
            let updateValue = {
              isConfirmEmail: true,
              code: "",
            };
            if (currentUser[0].isResetPassord)
              updateValue.isResetPassord = false;
            let updateUser = await MainHelper["user"].update(
              currentUser[0]._id,
              updateValue
            );
            if (updateUser) {
              if (currentUser[0].isResetPassord) {
                return h
                  .response({
                    message: "Email validé",
                    user: updateUser,
                    setPassword: true,
                  })
                  .code(200);
              } else {
                if (
                  currentUser[0].role.code === "super_admin" ||
                  currentUser[0].role.code === "agent_etablissement" ||
                  currentUser[0].role.code === "agent_mtca" ||
                  currentUser[0].role.code === "commissaire" ||
                  currentUser[0].role.code === "agent_police"
                ) {
                  return h
                    .response({
                      message: "Email validé",
                      user: updateUser,
                      setPassword: true,
                    })
                    .code(200);
                } else {
                  return h
                    .response({
                      message: "Email validé",
                      user: updateUser,
                      setPassword: false,
                    })
                    .code(200);
                }
              }
            } else {
              return h.response({ message: "Email validé" }).code(400);
            }
          } else {
            return h
              .response({
                message: "Paramètres invalides ou email déjà validé",
              })
              .code(400);
          }
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
      auth: "jwt",
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
          let data = await MainHelper[this.type].update(
            request.params.user,
            request.payload
          );
          // return h.response({ message: 'Done', [this.type]: data.user }).code(200);
          return h.response({ message: "Done" }).code(200);
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
      // payload: {
      //   output: 'stream',
      //   allow: 'multipart/form-data', // important,
      //   maxBytes: 10 * 1024 * 1024
      // },
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
      handler: async (request) => {
        try {
          let data = await MainHelper[this.type].remove(request.payload.id);
          //update agregat
          if (data) {
            let updateAgregat = await MainHelper["agregat"].updateOne(
              { table: "user" },
              { $inc: { count: -1 } },
              { upsert: true }
            );
          }
          delete data.user;
          return data;
        } catch (error) {
          return error.message;
        }
      },
      tags: ["api"],
    };
  }

  sendMail() {
    return {
      description: "Send mail",
      auth: false,
      payload: {
        output: "stream",
        allow: "multipart/form-data", // important,
        maxBytes: 10 * 1024 * 1024,
      },
      handler: async (request, h) => {
        try {
          let fs = require("fs");
          const object = JSON.parse(request.payload.objectdata);
          const pdfStreamReadable = request.payload.pdf;
          // const dir = "files/tmp/"
          const path = tmpDir + object.attachedFileName;

          if (object.attachedFileName) {
            // control si un fichier est envoyé
            //create directory if inexist
            if (!fs.existsSync(dir)) {
              fs.mkdirSync(dir, { recursive: true });
            }
            // create file
            if (pdfStreamReadable) {
              try {
                fs.createWriteStream(path).write(pdfStreamReadable._data);
              } catch (error) {
                console.log("error: ", error);
              }
            }
          }

          queue.push(
            {
              action: "sendMail",
              data: {
                receiver: object.to,
                receiverFullname: "",
                subject: object.subject,
                text: object.text ? object.text : null,
                htmlText: object.htmlText ? object.htmlText : null,
                buttonText: object.buttonText ? object.buttonText : "Continuez",
                buttonLink: object.buttonLink
                  ? object.buttonLink
                  : "http://youtube.com",
                attachedFile: null,
                attachedFileName: null,
              },
            },
            (error, response) => {
              // console.log('response: ', response);
            }
          );
          return h.response({ message: "Mail envoyé" }).code(200);
        } catch (error) {
          return error.message;
        }
      },
      tags: ["api"],
    };
  }

  nousContacter() {
    return {
      description: "Send mail suggestion meassage",
      auth: false,
      // payload: {
      //   output: 'stream',
      //   allow: 'multipart/form-data', // important,
      //   maxBytes: 10 * 1024 * 1024
      // },
      handler: async (request, h) => {
        try {
          if (
            !request.payload.mail ||
            !request.payload.message ||
            !request.payload.nomPrenoms ||
            !request.payload.sujet
          ) {
            return h.response({ message: "Mauvais paramètres" }).code(400);
          }
          queue.push(
            {
              action: "sendMail",
              data: {
                // sender:request.payload.mail, senderFullname:request.payload.nomPrenoms,
                receiver: "theontia@gmail.com",
                receiverFullname: "", // mtca.dsisa@gouv.bj
                subject: "SAV Hiretop",
                text: null,
                htmlText: request.payload.message,
                buttonShow: false,
                buttonText: null,
                buttonLink: null,
                attachedFile: null,
                attachedFileName: null,
                sav: true,
                savInfos: request.payload,
              },
            },
            (error, response) => {
              // console.log('response: ', response);
            }
          );

          // save in database
          let resultSaveSAV = await MainHelper["savemail"].create({
            fullname: request.payload.nomPrenoms,
            sender: request.payload.mail,
            receiver: "mtca.dsisa@gouv.bj", //mtca.dsisa@gouv.bj
            subject: request.payload.sujet,
            html: request.payload.message,
          });

          return h.response({ message: "Mail envoyé" }).code(200);
        } catch (error) {
          return error.message;
        }
      },
      tags: ["api"],
    };
  }

  checkToken() {
    return {
      description: "Check token validity",
      auth: "jwt",
      handler: async (request, h) => {
        try {
          return h.response({ message: "token check" }).code(200);
        } catch (error) {
          return error.message;
        }
      },
      tags: ["api"],
    };
  }
};
