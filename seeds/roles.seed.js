const fs = require('fs');
const Mongoose = require('mongoose');
const { resolve } = require('path');


const roleModel = require('../app/models/role.js')
const permissionModel = require('../app/models/permission.js')

const rolesAndPermissions = require('./rolesAndPermissions.json')


const getPermissionFor = (code) => {
    return rolesAndPermissions.find(e => e.code === code).permissions || []
}

let roles = rolesAndPermissions.map(rl => {
    const { nom, code } = rl
    const permissions = []
    return { nom, code, permissions }
})


/**
 ** In case you come with data from data base, you can purge these data with this function. 
 ** You have to paste your datas inside th function in the 'rawData' const
 *! Be aware that using nodemon may lead to infinite reloading as this function write file on the os and nodemon will reload indefinitly 
 */
const leanDBRawData = () => {
    const rawData = [
        {
            "_id": "62a9d9ae72ddc17065bb84fe",
            "permissions": [
                {
                    "_id": "62fa0fe45aa8c60b04fa1124",
                    "action": "read",
                    "subject": "etablissement",
                    "createdAt": "2022-08-15T09:20:36.181Z",
                    "updatedAt": "2022-08-15T09:20:36.181Z",
                    "__v": 0
                },
                {
                    "_id": "62acae97c84e3f00164ec3c3",
                    "action": "read",
                    "subject": "agentMtca",
                    "createdAt": "2022-06-17T16:40:55.822Z",
                    "updatedAt": "2022-06-17T16:40:55.822Z",
                    "__v": 0
                },
                {
                    "_id": "62fa116c5aa8c60b04fa1129",
                    "action": "read",
                    "subject": "agentEtablissement",
                    "createdAt": "2022-08-15T09:27:08.440Z",
                    "updatedAt": "2022-08-15T09:27:08.440Z",
                    "__v": 0
                },
                {
                    "_id": "62acae8dc84e3f00164ec3c2",
                    "action": "create",
                    "subject": "agentMtca",
                    "createdAt": "2022-06-17T16:40:45.073Z",
                    "updatedAt": "2022-06-17T16:40:45.073Z",
                    "__v": 0
                },
                {
                    "_id": "62acaeb9c84e3f00164ec3c5",
                    "action": "delete",
                    "subject": "agentMtca",
                    "createdAt": "2022-06-17T16:41:29.835Z",
                    "updatedAt": "2022-06-17T16:41:29.835Z",
                    "__v": 0
                },
                {
                    "_id": "62fba8a402bf5b403496105e",
                    "subject": "etablissementDetails",
                    "action": "read",
                    "createdAt": "2022-08-16T14:24:36.183Z",
                    "updatedAt": "2022-08-16T14:24:36.183Z",
                    "__v": 0
                },
                {
                    "_id": "6332e36aed58d7a89c9cff6a",
                    "subject": "commissaire",
                    "action": "read",
                    "createdAt": "2022-09-27T11:50:02.977Z",
                    "updatedAt": "2022-09-27T11:50:02.977Z",
                    "__v": 0
                },
                {
                    "_id": "6332e36fed58d7a89c9cff6d",
                    "subject": "commissaire",
                    "action": "update",
                    "createdAt": "2022-09-27T11:50:07.324Z",
                    "updatedAt": "2022-09-27T11:50:07.324Z",
                    "__v": 0
                },
                {
                    "_id": "6332e373ed58d7a89c9cff70",
                    "subject": "commissaire",
                    "action": "delete",
                    "createdAt": "2022-09-27T11:50:11.995Z",
                    "updatedAt": "2022-09-27T11:50:11.995Z",
                    "__v": 0
                },
                {
                    "_id": "6332e377ed58d7a89c9cff73",
                    "subject": "commissaire",
                    "action": "list",
                    "createdAt": "2022-09-27T11:50:15.647Z",
                    "updatedAt": "2022-09-27T11:50:15.647Z",
                    "__v": 0
                },
                {
                    "_id": "6332e366ed58d7a89c9cff67",
                    "subject": "commissaire",
                    "action": "create",
                    "createdAt": "2022-09-27T11:49:58.404Z",
                    "updatedAt": "2022-09-27T11:49:58.404Z",
                    "__v": 0
                }
            ],
            "nom": "Administrateur",
            "createdAt": "2022-06-15T13:07:58.819Z",
            "updatedAt": "2022-08-15T09:33:57.682Z",
            "__v": 1,
            "code": "super_admin"
        },
        {
            "_id": "62ab12de0d9dc7ff18cd8753",
            "nom": "Agent Etablissement",
            "permissions": [],
            "code": "agent_etablissement"
        },
        {
            "_id": "62ab61acee57f5591392cfc2",
            "nom": "Promoteur Etablissement",
            "permissions": [
                {
                    "_id": "62fa11675aa8c60b04fa1128",
                    "action": "create",
                    "subject": "agentEtablissement",
                    "createdAt": "2022-08-15T09:27:03.460Z",
                    "updatedAt": "2022-08-15T09:27:03.460Z",
                    "__v": 0
                },
                {
                    "_id": "62fa116c5aa8c60b04fa1129",
                    "action": "read",
                    "subject": "agentEtablissement",
                    "createdAt": "2022-08-15T09:27:08.440Z",
                    "updatedAt": "2022-08-15T09:27:08.440Z",
                    "__v": 0
                },
                {
                    "_id": "62fa11715aa8c60b04fa112a",
                    "action": "update",
                    "subject": "agentEtablissement",
                    "createdAt": "2022-08-15T09:27:13.513Z",
                    "updatedAt": "2022-08-15T09:27:13.513Z",
                    "__v": 0
                },
                {
                    "_id": "62fa11785aa8c60b04fa112b",
                    "action": "delete",
                    "subject": "agentEtablissement",
                    "createdAt": "2022-08-15T09:27:20.826Z",
                    "updatedAt": "2022-08-15T09:27:20.826Z",
                    "__v": 0
                },
                {
                    "_id": "62fba8a402bf5b403496105e",
                    "subject": "etablissementDetails",
                    "action": "read",
                    "createdAt": "2022-08-16T14:24:36.183Z",
                    "updatedAt": "2022-08-16T14:24:36.183Z",
                    "__v": 0
                }
            ],
            "code": "promo_etablissement"
        },
        {
            "_id": "62ac80e6c830d9a87912aeea",
            "nom": "Grand Public",
            "permissions": [
                {
                    "_id": "62fe288963dbaf7554ae8ad9",
                    "subject": "formulaireAgenceVoyage",
                    "action": "create",
                    "createdAt": "2022-08-18T11:54:49.084Z",
                    "updatedAt": "2022-08-18T11:54:49.084Z",
                    "__v": 0
                },
                {
                    "_id": "62fe289a63dbaf7554ae8ada",
                    "subject": "formulaireAgenceVoyage",
                    "action": "read",
                    "createdAt": "2022-08-18T11:55:06.576Z",
                    "updatedAt": "2022-08-18T11:55:06.576Z",
                    "__v": 0
                },
                {
                    "_id": "62fe3e2be866c88bc0f9f693",
                    "subject": "formulaireTransport",
                    "action": "create",
                    "createdAt": "2022-08-18T13:27:07.026Z",
                    "updatedAt": "2022-08-18T13:27:07.026Z",
                    "__v": 0
                },
                {
                    "_id": "62fe3fd26e947d8d93421925",
                    "subject": "formulaireTransport",
                    "action": "read",
                    "createdAt": "2022-08-18T13:34:10.794Z",
                    "updatedAt": "2022-08-18T13:34:10.794Z",
                    "__v": 0
                },
                {
                    "_id": "62fe40596e947d8d93421932",
                    "subject": "formulaireHotel",
                    "action": "create",
                    "createdAt": "2022-08-18T13:36:25.911Z",
                    "updatedAt": "2022-08-18T13:36:25.911Z",
                    "__v": 0
                },
                {
                    "_id": "62fe40606e947d8d93421933",
                    "subject": "formulaireHotel",
                    "action": "read",
                    "createdAt": "2022-08-18T13:36:32.097Z",
                    "updatedAt": "2022-08-18T13:36:32.097Z",
                    "__v": 0
                },
                {
                    "_id": "62fe69f2467016a1ed5e3e10",
                    "subject": "formulaireRestaurant",
                    "action": "create",
                    "createdAt": "2022-08-18T16:33:54.697Z",
                    "updatedAt": "2022-08-18T16:33:54.697Z",
                    "__v": 0
                },
                {
                    "_id": "62fe69f8467016a1ed5e3e11",
                    "subject": "formulaireRestaurant",
                    "action": "read",
                    "createdAt": "2022-08-18T16:34:00.590Z",
                    "updatedAt": "2022-08-18T16:34:00.590Z",
                    "__v": 0
                },
                {
                    "_id": "62fe457f6e947d8d93421936",
                    "subject": "formulaireLocationVehiculeSansOp",
                    "action": "create",
                    "createdAt": "2022-08-18T13:58:23.048Z",
                    "updatedAt": "2022-08-18T13:58:23.048Z",
                    "__v": 0
                },
                {
                    "_id": "62fe45826e947d8d93421937",
                    "subject": "formulaireLocationVehiculeSansOp",
                    "action": "read",
                    "createdAt": "2022-08-18T13:58:26.625Z",
                    "updatedAt": "2022-08-18T13:58:26.625Z",
                    "__v": 0
                },
                {
                    "_id": "62ff9ecf4ac512001654d2e4",
                    "subject": "formulaireServiceSportifRecreatif",
                    "action": "create",
                    "createdAt": "2022-08-19T14:31:43.561Z",
                    "updatedAt": "2022-08-19T14:31:43.561Z",
                    "__v": 0
                },
                {
                    "_id": "62ff9ed24ac512001654d2e5",
                    "subject": "formulaireServiceSportifRecreatif",
                    "action": "read",
                    "createdAt": "2022-08-19T14:31:46.870Z",
                    "updatedAt": "2022-08-19T14:31:46.870Z",
                    "__v": 0
                },
                {
                    "_id": "630ceb9dbcd85d562484beb4",
                    "subject": "formulaireFrontiereEntree",
                    "action": "create",
                    "createdAt": "2022-08-29T16:38:53.814Z",
                    "updatedAt": "2022-08-29T16:38:53.814Z",
                    "__v": 0
                },
                {
                    "_id": "630ceba2bcd85d562484beb5",
                    "subject": "formulaireFrontiereEntree",
                    "action": "read",
                    "createdAt": "2022-08-29T16:38:58.775Z",
                    "updatedAt": "2022-08-29T16:38:58.775Z",
                    "__v": 0
                },
                {
                    "_id": "630cebbabcd85d562484beb8",
                    "subject": "formulaireFrontiereSortie",
                    "action": "create",
                    "createdAt": "2022-08-29T16:39:22.591Z",
                    "updatedAt": "2022-08-29T16:39:22.591Z",
                    "__v": 0
                },
                {
                    "_id": "630cebbebcd85d562484beb9",
                    "subject": "formulaireFrontiereSortie",
                    "action": "read",
                    "createdAt": "2022-08-29T16:39:26.107Z",
                    "updatedAt": "2022-08-29T16:39:26.107Z",
                    "__v": 0
                }
            ],
            "code": "grand_public",
            "__v": 1,
            "createdAt": "2022-08-30T11:09:53.999Z",
            "updatedAt": "2022-08-30T11:09:53.999Z"
        },
        {
            "_id": "62ac8100c830d9a87912aeeb",
            "nom": "Agent Gouvernement (Agents Consultation Ministère)",
            "code": "agent_gouvernement",
            "permissions": [
                {
                    "_id": "62fba8a402bf5b403496105e",
                    "subject": "etablissementDetails",
                    "action": "read",
                    "createdAt": "2022-08-16T14:24:36.183Z",
                    "updatedAt": "2022-08-16T14:24:36.183Z",
                    "__v": 0
                }
            ]
        },
        {
            "_id": "62f0ca46410c4738b98af3f9",
            "permissions": [
                {
                    "_id": "62fa0fe45aa8c60b04fa1124",
                    "action": "read",
                    "subject": "etablissement",
                    "createdAt": "2022-08-15T09:20:36.181Z",
                    "updatedAt": "2022-08-15T09:20:36.181Z",
                    "__v": 0
                },
                {
                    "_id": "62acaf62c84e3f00164ec3ca",
                    "action": "read",
                    "subject": "statistiques",
                    "createdAt": "2022-06-17T16:44:18.742Z",
                    "updatedAt": "2022-06-17T16:44:18.742Z",
                    "__v": 0
                },
                {
                    "_id": "62fba8a402bf5b403496105e",
                    "subject": "etablissementDetails",
                    "action": "read",
                    "createdAt": "2022-08-16T14:24:36.183Z",
                    "updatedAt": "2022-08-16T14:24:36.183Z",
                    "__v": 0
                },
                {
                    "_id": "62ff4d9109cc3d00164ba471",
                    "subject": "etablissement",
                    "action": "validate",
                    "createdAt": "2022-08-19T08:45:05.519Z",
                    "updatedAt": "2022-08-19T08:45:05.519Z",
                    "__v": 0
                },
                {
                    "_id": "62ff4d9909cc3d00164ba472",
                    "subject": "etablissement",
                    "action": "reject",
                    "createdAt": "2022-08-19T08:45:13.864Z",
                    "updatedAt": "2022-08-19T08:45:13.864Z",
                    "__v": 0
                },
                {
                    "_id": "62fa0ffb5aa8c60b04fa1126",
                    "action": "update",
                    "subject": "etablissement",
                    "createdAt": "2022-08-15T09:20:59.156Z",
                    "updatedAt": "2022-08-15T09:20:59.156Z",
                    "__v": 0
                }
            ],
            "nom": "Agent MTCA",
            "createdAt": "2022-08-08T08:33:10.905Z",
            "updatedAt": "2022-08-15T10:54:20.351Z",
            "__v": 1,
            "code": "agent_mtca"
        },
        {
            "_id": "6332c115c30a5a93aca4c209",
            "permissions": [
                {
                    "_id": "6332e36aed58d7a89c9cff6a",
                    "subject": "commissaire",
                    "action": "read",
                    "createdAt": "2022-09-27T11:50:02.977Z",
                    "updatedAt": "2022-09-27T11:50:02.977Z",
                    "__v": 0
                },
                {
                    "_id": "63340ad9c03ac716a7e503ae",
                    "subject": "agentPolice",
                    "action": "create",
                    "createdAt": "2022-09-28T08:50:33.104Z",
                    "updatedAt": "2022-09-28T08:50:33.104Z",
                    "__v": 0
                },
                {
                    "_id": "63340adec03ac716a7e503b1",
                    "subject": "agentPolice",
                    "action": "read",
                    "createdAt": "2022-09-28T08:50:38.039Z",
                    "updatedAt": "2022-09-28T08:50:38.039Z",
                    "__v": 0
                },
                {
                    "_id": "63340ae2c03ac716a7e503b4",
                    "subject": "agentPolice",
                    "action": "update",
                    "createdAt": "2022-09-28T08:50:42.369Z",
                    "updatedAt": "2022-09-28T08:50:42.369Z",
                    "__v": 0
                },
                {
                    "_id": "63340ae7c03ac716a7e503b7",
                    "subject": "agentPolice",
                    "action": "delete",
                    "createdAt": "2022-09-28T08:50:47.297Z",
                    "updatedAt": "2022-09-28T08:50:47.297Z",
                    "__v": 0
                },
                {
                    "_id": "63340aedc03ac716a7e503ba",
                    "subject": "agentPolice",
                    "action": "action",
                    "createdAt": "2022-09-28T08:50:53.931Z",
                    "updatedAt": "2022-09-28T08:50:53.931Z",
                    "__v": 0
                },
                {
                    "_id": "63340b58c03ac716a7e503bf",
                    "subject": "agentPolice",
                    "action": "list",
                    "createdAt": "2022-09-28T08:52:40.699Z",
                    "updatedAt": "2022-09-28T08:52:40.699Z",
                    "__v": 0
                },
                {
                    "_id": "630ceba2bcd85d562484beb5",
                    "subject": "formulaireFrontiereEntree",
                    "action": "read",
                    "createdAt": "2022-08-29T16:38:58.775Z",
                    "updatedAt": "2022-08-29T16:38:58.775Z",
                    "__v": 0
                },
                {
                    "_id": "630cee18bcd85d562484bebd",
                    "subject": "formulaireFrontiereEntree",
                    "action": "list",
                    "createdAt": "2022-08-29T16:49:28.051Z",
                    "updatedAt": "2022-08-29T16:49:28.051Z",
                    "__v": 0
                },
                {
                    "_id": "630cebbebcd85d562484beb9",
                    "subject": "formulaireFrontiereSortie",
                    "action": "read",
                    "createdAt": "2022-08-29T16:39:26.107Z",
                    "updatedAt": "2022-08-29T16:39:26.107Z",
                    "__v": 0
                },
                {
                    "_id": "630cee11bcd85d562484bebc",
                    "subject": "formulaireFrontiereSortie",
                    "action": "list",
                    "createdAt": "2022-08-29T16:49:21.746Z",
                    "updatedAt": "2022-08-29T16:49:21.746Z",
                    "__v": 0
                }
            ],
            "nom": "Commissaire",
            "code": "commissaire",
            "createdAt": "2022-09-27T09:23:33.004Z",
            "updatedAt": "2022-09-27T09:23:33.004Z",
            "__v": 0
        },
        {
            "_id": "6332c12fc30a5a93aca4c20c",
            "permissions": [],
            "nom": "Agent INSTAD",
            "code": "agent_instad",
            "createdAt": "2022-09-27T09:23:59.991Z",
            "updatedAt": "2022-09-27T09:23:59.991Z",
            "__v": 0
        },
        {
            "_id": "6333355c9905d9c6d418f4b9",
            "permissions": [
                {
                    "_id": "630ceb9dbcd85d562484beb4",
                    "subject": "formulaireFrontiereEntree",
                    "action": "create",
                    "createdAt": "2022-08-29T16:38:53.814Z",
                    "updatedAt": "2022-08-29T16:38:53.814Z",
                    "__v": 0
                },
                {
                    "_id": "630cebbabcd85d562484beb8",
                    "subject": "formulaireFrontiereSortie",
                    "action": "create",
                    "createdAt": "2022-08-29T16:39:22.591Z",
                    "updatedAt": "2022-08-29T16:39:22.591Z",
                    "__v": 0
                },
                {
                    "_id": "63122d35cf14c4459820cc92",
                    "subject": "formulaireAeroportEntree",
                    "action": "create",
                    "createdAt": "2022-09-02T16:20:05.782Z",
                    "updatedAt": "2022-09-02T16:20:05.782Z",
                    "__v": 0
                },
                {
                    "_id": "63122d08cf14c4459820cc8c",
                    "subject": "formulaireAeroportSortie",
                    "action": "create",
                    "createdAt": "2022-09-02T16:19:20.690Z",
                    "updatedAt": "2022-09-02T16:19:20.690Z",
                    "__v": 0
                }
            ],
            "nom": "Agent Police",
            "code": "agent_police",
            "createdAt": "2022-09-27T17:39:40.390Z",
            "updatedAt": "2022-09-27T17:39:40.390Z",
            "__v": 0
        }
    ]

    const pp = rls.map(rl => {
        const { nom, code } = rl
        const permissions = rl.permissions.map(e => {
            const { subject, action } = e
            return { subject, action }
        })
        return { nom, code, permissions }
    })

    fs.writeFileSync('./roles.json', JSON.stringify(pp))

}
// leanDBRawData()

exports.run = async function () {
    const existingItemsCount = await roleModel.countDocuments()

    const permissionsList = await permissionModel.find()

    let newRoles = []
    newRoles = rolesAndPermissions.map(role => {
        let { permissions: rolePermissions } = role
        rolePermissions = rolePermissions.map(rp => {
            const { action, subject } = rp
            return permissionsList.find(perm => perm.action === action && perm.subject === subject)._id || ''
        })
        // console.log('matches :>> ', rolePermissions);
        return { ...role, permissions: rolePermissions }
    })


    if (existingItemsCount > 0) {
        console.log('Roles already exist. Lets Update each role');
        for (let i = 0; i < newRoles.length; i++) {
            const role = newRoles[i]
            // console.log(role,i);
            const { code, permissions } = role
            const query = { code };
            const update = { $set: { ...role } };
            const options = { upsert: true };
            await roleModel.updateOne(query, update, options);
            console.log('Updating role :>> ', code);
        }

        console.log('---------------------------------------------->');
        console.log('Updated Roles table succesfully');
        console.log('Old items :>> ', existingItemsCount);
        console.log('News items :>> ', newRoles.length - existingItemsCount);
        console.log('---------------------------------------------->');
        return
    }

    const insertRequest = await roleModel.insertMany(newRoles)
    console.log('Seed Roles table succesfully :>> ', insertRequest);
}





