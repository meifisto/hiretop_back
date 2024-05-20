'use strict';

const Hoek = require('hoek');
const appAbilities = require('../acl/casl/abilities')

/**
 * 
 * @param {*} request Hapi js request
 * @returns routes ability object
 */
const getAbilityFromRoute = (request) => {
  const preItem = (request.route.settings.pre || []).find(e => e.assign === 'ability')
  if (preItem) return preItem['method']()
  return {}
}

const abilityMiddleware = function (request, h) {
  // console.log('request::: ⭕️', request);
  const authCredentials = request.auth.credentials;
  // console.log('authCredentials::: ⭕️', authCredentials);
  if (authCredentials) {
    const routeAbility = getAbilityFromRoute(request);
    // console.log('routeAbility::: ', routeAbility);

    const ability = appAbilities.defineAbilityFor(authCredentials);
    // console.log('ability::: ', ability);

    let canNavigateTo = ability.can(routeAbility.action, routeAbility.subject);
    if (!canNavigateTo) {
      return h.response({ message: `Vous n'avez pas la permission d'accéder à cette ressource` }).code(401);
    }
  }
  // console.log('::: continuous route', );
  return h.continue;
}
exports.plugin = {
  register: async (plugin, options) => {
    plugin.ext('onPreResponse', (request, h) => {
      try {
        var internals = {
          devEnv: (process.env.NODE_ENV === 'development'),
          meta: options.meta,
          credentials: request.auth.isAuthenticated ? request.auth.credentials : null
        };

        var response = request.response;
        if (response.variety && response.variety === 'view') {
          response.source.context = Hoek.merge(internals, request.response.source.context);
        }
        return abilityMiddleware(request, h)
        //  return h.continue;
      } catch (error) { throw error; }
    });
  },
  pkg: require('../package.json'),
  name: 'context'
};