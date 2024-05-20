const Mongoose = require('mongoose');
const { resolve } = require('path');


const permissionModel = require('../app/models/permission.js')

const permissions = [
        {
            "action": "manage",
            "subject": "all"
        },
        {
            "action": "create",
            "subject": "agentMtca",
        },
        {
            "action": "read",
            "subject": "agentMtca",
        },
        {
            "action": "update",
            "subject": "agentMtca",
        },
        {
            "action": "delete",
            "subject": "agentMtca",
        },
        {
            "action": "read",
            "subject": "statistiques",
        },
        {
            "subject": "agentGouv",
            "action": "delete",
        },
        {
            "subject": "agentGouv",
            "action": "update",
        },
        {
            "subject": "agentGouv",
            "action": "read",
        },
        {
            "subject": "agentGouv",
            "action": "create",
        },
        {
            "subject": "public",
            "action": "create",
        },
        {
            "subject": "public",
            "action": "read",
        },
        {
            "subject": "public",
            "action": "update",
        },
        {
            "subject": "public",
            "action": "delete",
        },
        {
            "subject": "promoteur",
            "action": "delete",
        },
        {
            "subject": "promoteur",
            "action": "update",
        },
        {
            "subject": "promoteur",
            "action": "read",
        },
        {
            "subject": "promoteur",
            "action": "create",
        },
        {
            "action": "read",
            "subject": "etablissement",
        },
        {
            "action": "create",
            "subject": "etablissement",
        },
        {
            "action": "update",
            "subject": "etablissement",
        },
        {
            "action": "delete",
            "subject": "etablissement",
        },
        {
            "action": "create",
            "subject": "agentEtablissement",
        },
        {
            "action": "read",
            "subject": "agentEtablissement",
        },
        {
            "action": "update",
            "subject": "agentEtablissement",
        },
        {
            "action": "delete",
            "subject": "agentEtablissement",
        },
        {
            "action": "create",
            "subject": "formulaireAgenceVoyageMensuel",
        },
        {
            "action": "read",
            "subject": "formulaireAgenceVoyageMensuel",
        },
        {
            "action": "update",
            "subject": "formulaireAgenceVoyageMensuel",
        },
        {
            "action": "delete",
            "subject": "formulaireAgenceVoyageMensuel",
        },
        {
            "subject": "formulaires",
            "action": "create",
        },
        {
            "subject": "formulaires",
            "action": "read",
        },
        {
            "subject": "formulaires",
            "action": "update",
        },
        {
            "subject": "formulaires",
            "action": "remove",
        },
        {
            "action": "create",
            "subject": "formulaireLocationVehiculeSansOpMensuel",
        },
        {
            "action": "read",
            "subject": "formulaireLocationVehiculeSansOpMensuel",
        },
        {
            "action": "update",
            "subject": "formulaireLocationVehiculeSansOpMensuel",
        },
        {
            "action": "delete",
            "subject": "formulaireLocationVehiculeSansOpMensuel",
        },
        {
            "subject": "etablissementDetails",
            "action": "read",
        },
        {
            "subject": "formulaireAgenceVoyage",
            "action": "create",
        },
        {
            "subject": "formulaireAgenceVoyage",
            "action": "read",
        },
        {
            "subject": "formulaireAgenceVoyage",
            "action": "update",
        },
        {
            "subject": "formulaireTransport",
            "action": "create",
        },
        {
            "subject": "formulaireTransport",
            "action": "read",
        },
        {
            "subject": "formulaireTransport",
            "action": "update",
        },
        {
            "subject": "formulaireTransport",
            "action": "delete",
        },
        {
            "subject": "formulaireTransportMensuel",
            "action": "delete",
        },
        {
            "subject": "formulaireTransportMensuel",
            "action": "update",
        },
        {
            "subject": "formulaireTransportMensuel",
            "action": "read",
        },
        {
            "subject": "formulaireTransportMensuel",
            "action": "create",
        },
        {
            "subject": "formulaireHotelMensuel",
            "action": "create",
        },
        {
            "subject": "formulaireHotelMensuel",
            "action": "read",
        },
        {
            "subject": "formulaireHotelMensuel",
            "action": "update",
        },
        {
            "subject": "formulaireHotelMensuel",
            "action": "delete",
        },
        {
            "subject": "formulaireHotel",
            "action": "delete",
        },
        {
            "subject": "formulaireHotel",
            "action": "update",
        },
        {
            "subject": "formulaireHotel",
            "action": "create",
        },
        {
            "subject": "formulaireHotel",
            "action": "read",
        },
        {
            "subject": "formulaireAgenceVoyage",
            "action": "delete",
        },
        {
            "subject": "formulaireLocationVehiculeSansOp",
            "action": "create",
        },
        {
            "subject": "formulaireLocationVehiculeSansOp",
            "action": "read",
        },
        {
            "subject": "formulaireLocationVehiculeSansOp",
            "action": "update",
        },
        {
            "subject": "formulaireLocationVehiculeSansOp",
            "action": "delete",
        },
        {
            "subject": "formulaireRestaurant",
            "action": "create",
        },
        {
            "subject": "formulaireRestaurant",
            "action": "read",
        },
        {
            "subject": "formulaireRestaurant",
            "action": "update",
        },
        {
            "subject": "formulaireRestaurant",
            "action": "delete",
        },
        {
            "subject": "formulaireRestaurantMensuel",
            "action": "delete",
        },
        {
            "subject": "formulaireRestaurantMensuel",
            "action": "update",
        },
        {
            "subject": "formulaireRestaurantMensuel",
            "action": "read",
        },
        {
            "subject": "formulaireRestaurantMensuel",
            "action": "create",
        },
        {
            "subject": "etablissement",
            "action": "validate",
        },
        {
            "subject": "etablissement",
            "action": "reject",
        },
        {
            "subject": "formulaireServiceCulturel",
            "action": "create",
        },
        {
            "subject": "formulaireServiceCulturel",
            "action": "read",
        },
        {
            "subject": "formulaireServiceCulturel",
            "action": "update",
        },
        {
            "subject": "formulaireServiceCulturel",
            "action": "delete",
        },
        {
            "subject": "formulaireServiceCulturelMensuel",
            "action": "delete",
        },
        {
            "subject": "formulaireServiceCulturelMensuel",
            "action": "update",
        },
        {
            "subject": "formulaireServiceCulturelMensuel",
            "action": "read",
        },
        {
            "subject": "formulaireServiceCulturelMensuel",
            "action": "create",
        },
        {
            "subject": "formulaireServiceSportifRecreatif",
            "action": "create",
        },
        {
            "subject": "formulaireServiceSportifRecreatif",
            "action": "read",
        },
        {
            "subject": "formulaireServiceSportifRecreatif",
            "action": "update",
        },
        {
            "subject": "formulaireServiceSportifRecreatif",
            "action": "delete",
        },
        {
            "subject": "formulaireServiceSportifRecreatifMensuel",
            "action": "delete",
        },
        {
            "subject": "formulaireServiceSportifRecreatifMensuel",
            "action": "update",
        },
        {
            "subject": "formulaireServiceSportifRecreatifMensuel",
            "action": "read",
        },
        {
            "subject": "formulaireServiceSportifRecreatifMensuel",
            "action": "create",
        },
        {
            "subject": "formulaireFrontiereEntree",
            "action": "create",
        },
        {
            "subject": "formulaireFrontiereEntree",
            "action": "read",
        },
        {
            "subject": "formulaireFrontiereEntree",
            "action": "update",
        },
        {
            "subject": "formulaireFrontiereEntree",
            "action": "delete",
        },
        {
            "subject": "formulaireFrontiereSortie",
            "action": "create",
        },
        {
            "subject": "formulaireFrontiereSortie",
            "action": "read",
        },
        {
            "subject": "formulaireFrontiereSortie",
            "action": "update",
        },
        {
            "subject": "formulaireFrontiereSortie",
            "action": "delete",
        },
        {
            "subject": "formulaireFrontiereSortie",
            "action": "list",
        },
        {
            "subject": "formulaireFrontiereEntree",
            "action": "list",
        },
        {
            "subject": "formulaires",
            "action": "list",
        },
        {
            "subject": "formulaireAgenceVoyage",
            "action": "list",
        },
        {
            "subject": "formulaireAgenceVoyageMensuel",
            "action": "list",
        },
        {
            "subject": "formulaireTransport",
            "action": "list",
        },
        {
            "subject": "formulaireTransportMensuel",
            "action": "list",
        },
        {
            "subject": "formulaireHotel",
            "action": "list",
        },
        {
            "subject": "formulaireHotelStat",
            "action": "list",
        },
        {
            "subject": "formulaireRestaurant",
            "action": "list",
        },
        {
            "subject": "formulaireRestaurantMensuel",
            "action": "list",
        },
        {
            "subject": "formulaireLocationVehiculeSansOp",
            "action": "list",
        },
        {
            "subject": "formulaireLocationVehiculeSansOpMensuel",
            "action": "list",
        },
        {
            "subject": "formulaireServiceSportifRecreatif",
            "action": "list",
        },
        {
            "subject": "formulaireServiceSportifRecreatifMensuel",
            "action": "list",
        },
        {
            "subject": "formulaireServiceCulturel",
            "action": "list",
        },
        {
            "subject": "formulaireServiceCulturelMensuel",
            "action": "list",
        },
        {
            "subject": "formulaireHotelMensuel",
            "action": "list",
        },
        {
            "subject": "formulaireAeroportSortie",
            "action": "create",
        },
        {
            "subject": "formulaireAeroportSortie",
            "action": "read",
        },
        {
            "subject": "formulaireAeroportSortie",
            "action": "update",
        },
        {
            "subject": "formulaireAeroportSortie",
            "action": "delete",
        },
        {
            "subject": "formulaireAeroportSortie",
            "action": "list",
        },
        {
            "subject": "formulaireAeroportEntree",
            "action": "list",
        },
        {
            "subject": "formulaireAeroportEntree",
            "action": "create",
        },
        {
            "subject": "formulaireAeroportEntree",
            "action": "read",
        },
        {
            "subject": "formulaireAeroportEntree",
            "action": "update",
        },
        {
            "subject": "formulaireAeroportEntree",
            "action": "delete",
        },
        {
            "subject": "formulaireTourismeEmetteur",
            "action": "create",
        },
        {
            "subject": "formulaireTourismeEmetteur",
            "action": "read",
        },
        {
            "subject": "formulaireTourismeEmetteur",
            "action": "update",
        },
        {
            "subject": "formulaireTourismeEmetteur",
            "action": "delete",
        },
        {
            "subject": "formulaireTourismeEmetteur",
            "action": "list",
        },
        {
            "subject": "formulaireTourismeRecepteur",
            "action": "list",
        },
        {
            "subject": "formulaireTourismeRecepteur",
            "action": "create",
        },
        {
            "subject": "formulaireTourismeRecepteur",
            "action": "read",
        },
        {
            "subject": "formulaireTourismeRecepteur",
            "action": "update",
        },
        {
            "subject": "formulaireTourismeRecepteur",
            "action": "delete",
        },
        {
            "subject": "formulaireTourismeInterne",
            "action": "create",
        },
        {
            "subject": "formulaireTourismeInterne",
            "action": "read",
        },
        {
            "subject": "formulaireTourismeInterne",
            "action": "update",
        },
        {
            "subject": "formulaireTourismeInterne",
            "action": "delete",
        },
        {
            "subject": "formulaireTourismeInterne",
            "action": "list",
        },
        {
            "subject": "formulaireStatistiquesMensuels",
            "action": "create",
        },
        {
            "subject": "formulaireStatistiquesMensuels",
            "action": "read",
        },
        {
            "subject": "formulaireStatistiquesMensuels",
            "action": "update",
        },
        {
            "subject": "formulaireStatistiquesMensuels",
            "action": "delete",
        },
        {
            "subject": "formulaireStatistiquesMensuels",
            "action": "list",
        },
        {
            "subject": "commissaire",
            "action": "create",
        },
        {
            "subject": "commissaire",
            "action": "read",
        },
        {
            "subject": "commissaire",
            "action": "update",
        },
        {
            "subject": "commissaire",
            "action": "delete",
        },
        {
            "subject": "commissaire",
            "action": "list",
        },
        {
            "subject": "agentPolice",
            "action": "create",
        },
        {
            "subject": "agentPolice",
            "action": "read",
        },
        {
            "subject": "agentPolice",
            "action": "update",
        },
        {
            "subject": "agentPolice",
            "action": "delete",
        },
        {
            "subject": "agentPolice",
            "action": "action",
        },
        {
            "subject": "agentPolice",
            "action": "list",
        },
        {
            "subject": "etablissement",
            "action": "administrate",
        },
        {
            "subject": "utilisateur",
            "action": "administrate",
        },
        {
            "subject": "statsTest",
            "action": "read",
        }
    ]


exports.run = async function(){
    const existingItemsCount = await permissionModel.countDocuments()
    if(existingItemsCount>0) {
        console.error('Permissions table already exist. Skip seed');
        return 
    }

    const insertRequest = await permissionModel.insertMany(permissions) 
    console.log('Seed Permissons table succesfully :>> ', insertRequest);
}





