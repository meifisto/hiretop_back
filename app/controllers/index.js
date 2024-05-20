const UserController = require('./user');
const ResourceController = require('./resource');
const StatistiqueController = require('./statistique');
const validation = require('../validations');

module.exports = {
  user: new UserController('user', 'users', validation.user),

  talentsprofiles: new ResourceController('talentprofil', 'talentprofils', validation.talentprofil),
  businessprofiles: new ResourceController('businessprofil', 'businessprofils', validation.businessprofil),
  candidacy: new ResourceController('candidacy', 'candidacies', validation.candidacy),
  savemail: new ResourceController('savemail', 'savemails', validation.savemail),
  role: new ResourceController('role', 'roles', validation.role),
  offre: new ResourceController('offre', 'offres', validation.offre),
  permission: new ResourceController('permission', 'permissions', validation.permission),
  sector: new ResourceController('sector', 'sectors', validation.sector),

  stats: new StatistiqueController()
};