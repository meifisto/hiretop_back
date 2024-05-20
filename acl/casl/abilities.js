const casl = require("@casl/ability");
const { AbilityBuilder, createMongoAbility } = casl;
const rolesAndPermissions = require("../../seeds/rolesAndPermissions.json");

const getPermissionFor = (code) => {
  // console.log('code :::: >> ', code)
  return (
    (rolesAndPermissions.find((e) => e.code === code) || { permissions: [] })
      .permissions || []
  );
};

/**
 * * Permissions super_admin
 * ! Pour proteger une route il faut definir sur la route une fonction 'pre' qui a un 'assign'==='ability'
 * *
 */
const adminsPermissions = [
  // ...getPermissionFor("admin"),
  // ? routes permissions
  { action: "read", subject: "Public" },
];
/**
 * * Permissions agent_mtca
 */
const businessPermissions = [
  // ...getPermissionFor("business"),
  { action: "read", subject: "Public" },
];
/**
 * * Permissions promo_etablissement
 */
const talentPermissions = [
  // ...getPermissionFor("talent"),
  { action: "read", subject: "Public" },
];


/**
 *
 * @param {*} user
 * @returns abilities according to user's role
 * @important Pour reduire la taille de la fonction les permissions pour chaque role sont definies plus haut, un tableau pour chaque role...
 */
exports.defineAbilityFor = (user) => {
  const { can, cannot, build } = new AbilityBuilder(createMongoAbility);

  if (!user) {
    // TODO: what if no user provided in ?
  }

  const { role: role_code } = user;
  // console.log('\n\n', 'role_code: ================ ', role_code, '\n\n')

  // admin
  const isAdmin = role_code === "admin";
  if (isAdmin) {
    // ? build ability object based on permissions array
    // console.log('admin --------------------------------- ⭕️')
    adminsPermissions.forEach((permission) => {
      const { action, subject, validate } = permission;
      if (!validate) {
        can(action, subject);
      } else {
        can(action, subject, validate(user) || {});
      }
    });

    /**
     * * add additionnal permisions bellow this comment if needed
     * eg: can('read', 'agents', {id: user.userId})
     */
  }
  // business
  const isBusiness = role_code === "business";
  if (isBusiness) {
    // console.log('business --------------------------------- ⭕️')
    businessPermissions.forEach((permission) => {
      const { action, subject, validate } = permission;
      if (!validate) {
        can(action, subject);
      } else {
        can(action, subject, validate(user) || {});
      }
    });
  }

  // talent
  const istalent = role_code === "talent";
  if (istalent) {
    // console.log('talent --------------------------------- ⭕️')
    talentPermissions.forEach((permission) => {
      const { action, subject, validate } = permission;
      if (!validate) {
        can(action, subject);
      } else {
        // console.log('⭕️', user)
        // console.log('⭕️⭕️', validate(user));
        // console.log('-------------------------------------------')
        let result = can(action, subject, validate(user) || {});
        // console.log('result: ', result)
        // console.log('can(action, subject, validate(user) || {}): ', can(action, subject, validate(user) || {}));
      }
    });
  }

  // ? Global permissions for all roles
  // cannot('delete', 'Post', { published: true });

  return build();
};
