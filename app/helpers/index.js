const UserHelper = require("./user");
const ResourceHelper = require("./resource");

module.exports = {
  user: new UserHelper("User", "email", "role business_associated talent_associated", "password"),

  talentprofil: new ResourceHelper("Talentprofil", "sector user", "-__v"),
  businessprofil: new ResourceHelper("Businessprofil", "sector user", "-__v"),
  candidacy: new ResourceHelper("Candidacy", "offer talent talentUser sector business", "-__v"),
  savemail: new ResourceHelper("SavEmail", "", "-__v"),
  role: new ResourceHelper("Role", "permissions", "-__v"),
  offre: new ResourceHelper("Offre", "business_associated sector", "-__v"),
  permission: new ResourceHelper("Permission", "", "-__v"),
  sector: new ResourceHelper("Sector", "", "-__v"),
};
