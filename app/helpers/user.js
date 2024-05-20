'use strict';
const Mongoose = require('mongoose');

module.exports = class UserHelper {

  constructor(model, loginField, populateFields) {
    require('../models/' + model.toLowerCase());
    this.User = Mongoose.model(model)
    this.loginField = loginField;
    this.populateFields = populateFields || "";
  }


  async get (id) {
    return new Promise(async (resolve, reject) => {
      try {
        let user = await this.User.findOne({_id: id})
          .populate(this.populateFields);
        return resolve(user);
      } catch (error) {
        return reject(error);
      }
    });
  };

  async count (query = {}) {
    return new Promise(async (resolve, reject) => {
      try {
        // let users = await this.User.count(query);
        let users = await this.User.countDocuments(query);
        return resolve(users);
      }
      catch (error) {
        return reject(error);
      }
    });
  };
  
  async countAll (query = {}, aggregator) {
    return new Promise(async (resolve, reject) => {
      try {
        let users = await this.User.aggregate([
          {
            $match: query
          },
          {
            $group: {
              _id: "$" + aggregator,
              total: { $sum: 1 }
            }
          }
        ]).allowDiskUse(true);

        return resolve(users);
      }
      catch (error) {
        return reject(error);
      }
    });
  };

  async list (query = {}, page = 0, size = 15, sort = {}) {
    return new Promise(async (resolve, reject) => {
      try {
        let users = await this.User.find(query)
          .populate(this.populateFields)
          .skip(page * size)
          .limit(size)
          .sort(sort)
          .lean();

        return resolve(users);
      }
      catch (error) {
        return reject(error);
      }
    });
  };

  async findByCredentials (username, password) {
    return new Promise(async (resolve, reject) => {
      try {
        var query = {
          [this.loginField]: username
        };
        let user = await this.User.findOne(query)
          .populate(this.populateFields);
        if (!user || !user.authenticate(password)) {
          return resolve({
            statusCode: 401,
            message: 'Identifiant ou mot de passe incorrect'
          });
        }
        return resolve({
          statusCode: 200,
          user: user
        });
      }
      catch (error) {
        return reject(error);
      }
    });
  };

  async findByEmail (email) {
    return new Promise(async (resolve, reject) => {
      try {
        var query = {
          [this.loginField]: email
        };
        let user = await this.User.findOne(query)
          .populate(this.populateFields);
        if (!user) {
          return resolve({
            statusCode: 401,
            message: 'Identifiant incorrect'
          });
        }
        return resolve({
          statusCode: 200,
          user: user
        });
      }
      catch (error) {
        return reject(error);
      }
    });
  };

  async register (userData) {
    return new Promise(async (resolve, reject) => {
      try {
        let data = await this.isUserAlreadyExist(userData[this.loginField]);
        if (data) {
          return resolve({ statusCode: 409, message: 'Adresse email déjà utilisée' });
        }
        else {
          let user = new this.User(userData);
          let savedUser = await user.save();
          return resolve({ statusCode: 200, message: 'Enregistrement réussi', user: savedUser });
        }
      }
      catch (error) {
        return reject(error);
      }
    });
  }

  async isUserAlreadyExist (username) {
    return new Promise(async (resolve, reject) => {
      try {
        var query = {};
        query[this.loginField] = username.toLowerCase();
        let user = await this.User.findOne(query);
        if (user) {
          return resolve(user);
        }
        return resolve();
      }
      catch (error) {
        return reject(error);
      }
    });
  };

  async findUserDetails (userId) {
    return new Promise(async (resolve, reject) => {
      try {
        let userDetails = await this.User
          .findOne({ _id: Mongoose.Types.ObjectId(userId) }, '-password -__v')
          .populate(this.populateFields);
        return resolve(userDetails);
      }
      catch (error) {
        return reject(error);
      }
    });
  };

  async update (userId, userData) {
    return new Promise(async (resolve, reject) => {
      try {
        let user = await this.User.findById(userId);

        for (var prop in userData) {
          user[prop] = userData[prop];
        }
        let savedData = await user.save();
        return resolve({
          statusCode: 200,
          user: savedData,
          message: 'User saved successfully'
        });
      }
      catch (error) {
        reject(error);
      }
    });
  };

  async remove (userId) {
    return new Promise(async (resolve, reject) => {
      try {
        let removedUser = await this.User.remove({ _id: userId });
        return resolve({ statusCode: 200, message: 'User supprimé', user: removedUser });
      }
      catch (error) {
        return reject(error);
      }
    });
  };

  async removeAll () {
    return new Promise(async (resolve, reject) => {
      try {
        let removedResources = await this.User.remove();
        return resolve({ statusCode: 200, message: 'Resources supprimées' });
      } catch (error) {
        return reject(error);
      }
    });
  };

  // async drop () {
  //   return new Promise(async (resolve, reject) => {
  //     try {
  //       console.log('this.Resource::: ', this.Resource)
  //       let removedResources = await this.User.drop();
  //       return resolve({ statusCode: 200, message: 'Collection supprimée' });
  //     } catch (error) {
  //       return reject(error);
  //     }
  //   });
  // };
};