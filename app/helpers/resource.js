"use strict";
const { da } = require("date-fns/locale");
const Mongoose = require("mongoose");
const { accessibleBy } = require("@casl/mongoose");
const { LocalStorage } = require("node-localstorage");
const appAbilities = require("../../acl/casl/abilities");

const AbilityBuilder = require("@casl/ability");

const ability_route = AbilityBuilder.defineAbility((can) => {
  can("read", "FormStatTransport", ["_id"], { public: true });
});

module.exports = class ResourceHelper {
  constructor(model, populateFields, hideFields) {
    // console.log('model::: ', model);
    require("../models/" + model.toLowerCase());
    this.Resource = Mongoose.model(model);
    this.populateFields = populateFields || "";
    this.hideFields = hideFields || "";
  }

  async list( query = {}, page = 0, size = 0, sort = {}, authCredentials ) {
    // const ability_auth = appAbilities.defineAbilityFor(authCredentials);

    return new Promise(async (resolve, reject) => {
      try {
        try {
          let resources = await this.Resource.find(query)
            .populate(this.populateFields)
            .skip(page * size)
            .limit(size)
            .sort(sort)
            // .hideIndex(this.hideFields)
            .lean();
          return resolve(resources);
        } catch (error) {
          reject(error);
        }
      } catch (error) {
        return reject(error);
      }
    });
  }

  async findOneByProp(prop, value) {
    return new Promise(async (resolve, reject) => {
      try {
        let resource = await this.Resource.findOne({ [prop]: value }).populate(
          this.populateFields
        );
        return resolve(resource);
      } catch (error) {
        return reject(error);
      }
    });
  }

  async get(id) {
    return new Promise(async (resolve, reject) => {
      try {
        let resource = await this.Resource.findOne({ _id: id }).populate(
          this.populateFields
        );
        return resolve(resource);
      } catch (error) {
        return reject(error);
      }
    });
  }

  async createOrUpdate(data, filter) {
    return new Promise(async (resolve, reject) => {
      try {
        let c = 0,
          u = 0;
        let dataSaved = [];
        for (var i = 0; i < data.length; i++) {
          const datum = data[i];

          let filteredData = {};

          if (filter) {
            for (var j = 0; j < filter.length; j++) {
              filteredData[filter[j]] = datum[filter[j]];
            }
          } else {
            filteredData = datum;
          }

          var doc = await this.Resource.findOne(filteredData);

          if (doc) {
            for (var p in datum) {
              doc[p] = datum[p];
            }
            dataSaved.push(await doc.save());
            u++;
          } else {
            dataSaved.push(await this.Resource.create(datum));
            c++;
          }
        }

        return resolve({
          statusCode: 200,
          message:
            "Enregistrement réussi (" + c + " créées, " + u + " mis à jour)",
          resources: dataSaved,
        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  async fieldValues(field = "") {
    return new Promise(async (resolve, reject) => {
      try {
        let resources = await this.Resource.distinct(field);
        return resolve(resources);
      } catch (error) {
        return reject(error);
      }
    });
  }

  async listforexport(query = {}, page = 0, size = 0, sort = {}) {
    return new Promise(async (resolve, reject) => {
      try {
        let resources = await this.Resource.find(query)
          .populate(this.populateFields)
          .skip(page * size)
          .limit(size)
          .sort(sort)
          .lean();
        return resolve(resources);
      } catch (error) {
        return reject(error);
      }
    });
  }

  async count(query = {}) {
    return new Promise(async (resolve, reject) => {
      try {
        // let resources = await this.Resource.count(query);
        let resources = await this.Resource.countDocuments(query);
        return resolve(resources);
      } catch (error) {
        return reject(error);
      }
    });
  }

  async create(resourceData) {
    // console.log('create resourceData::: ⭕️🔴', resourceData);
    return new Promise(async (resolve, reject) => {
      try {
        let resource = new this.Resource(resourceData);
        let savedResource = await resource.save();
        return resolve({
          statusCode: 200,
          message: "Enregistrement réussi",
          resource: savedResource,
        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  async createMany(resourcesData) {
    return new Promise(async (resolve, reject) => {
      try {
        let savedResources = await this.Resource.create(resourcesData);
        return resolve({
          statusCode: 200,
          message: "Enregistrement réussi",
          resources: savedResources,
        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  async update(resourceId, resourceData) {
    return new Promise(async (resolve, reject) => {
      try {
        let resource = await this.Resource.findById(resourceId);

        for (var prop in resourceData) {
          resource[prop] = resourceData[prop];
        }
        let savedData = await resource.save();

        return resolve({
          statusCode: 200,
          resource: savedData,
          message: "Resource saved successfully",
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  async updateOne(query = {}, data = {}, options = {}) {
    return new Promise(async (resolve, reject) => {
      try {
        let resource = await this.Resource.updateOne(query, data, options);
        return resolve({
          statusCode: 200,
          resource,
          message: "Resource updated successfully",
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  async remove(resourceId) {
    return new Promise(async (resolve, reject) => {
      try {
        let removedResource = await this.Resource.remove({ _id: resourceId });
        return resolve({
          statusCode: 200,
          message: "Resource supprimée",
          resource: removedResource,
        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  async removeMany(resourceIds) {
    return new Promise(async (resolve, reject) => {
      try {
        let removedResources = await this.Resource.remove({
          _id: { $in: resourceIds },
        });
        return resolve({
          statusCode: 200,
          message: "Resource supprimée",
          resource: removedResources,
        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  async removeAll() {
    return new Promise(async (resolve, reject) => {
      try {
        let removedResources = await this.Resource.remove();
        return resolve({ statusCode: 200, message: "Resources supprimées" });
      } catch (error) {
        return reject(error);
      }
    });
  }

  // async drop () {
  //   return new Promise(async (resolve, reject) => {
  //     try {
  //       let removedResources = await this.Resource.drop();
  //       return resolve({ statusCode: 200, message: 'Collection supprimée' });
  //     } catch (error) {
  //       return reject(error);
  //     }
  //   });
  // };

  // async removeBySchool (ecoleId) {
  //   return new Promise(async (resolve, reject) => {
  //     try {
  //       let removedResource = await this.Resource.remove({ecole: ecoleId});
  //       return resolve({ statusCode: 200, message: 'Resources supprimées suivant école', resource: removedResource });
  //     } catch (error) {
  //       return reject(error);
  //     }
  //   });
  // };
};
