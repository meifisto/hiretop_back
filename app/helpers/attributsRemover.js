'use strict';

exports.cleanArray = (array, addUnableAttributs = [], type) => {
    
    // console.log('addUnableAttributs: ', addUnableAttributs)
    let attributs = ['__v', 'updatedAt', 'isResetPassord','password', 'isArchive'] 
    // if( type === 'admin') attributs.push(...['role'])
    if(addUnableAttributs) attributs.push(...addUnableAttributs) // add personnal attribut

    // console.log('attributs ::::::::::::::::::: ', attributs)

    let objectsAtributs = {
        auteur: ['_id', 'isConfirmEmail', 'isArchive', 'password', 'code', 'isResetPassord', '__v', 'updatedAt', 'fiches'],
        auteurRole: ['permissions', '_id', 'updatedAt'],
        etablissement: ['isActive', '__v', 'typeEtablissement', 'updatedAt'],
        role: [ '_id', 'updatedAt'], //'permissions',
    } 
    let objectsAtributsKeys = Object.keys(objectsAtributs)

    return new Promise(async function(resolve, reject) {
        try {
            let newResult = []
            for (let index = 0; index < array.length; index++) {
                let element = JSON.parse(JSON.stringify(array[index]))
                // console.log('🩸 element: 1', '🩸🩸🩸', Object.keys(element));
                for (let indexAttribut = 0; indexAttribut < attributs.length; indexAttribut++) {
                    // console.log('element[attributs[indexAttribut]]: ', attributs[indexAttribut], element[attributs[indexAttribut]]);
                    delete element[attributs[indexAttribut]]
                    // console.log('🩸 element: 2',  '🩸🩸🩸', Object.keys(element));
                }

                newResult.push( element )

                // console.log('-------------- 2  ', array[0], '-------------------------------')

                // treatment for attributs with typeof = object
                for (let indexObject = 0; indexObject < objectsAtributsKeys.length; indexObject++) {
                    let currentObject = objectsAtributsKeys[indexObject];
                    if( element[currentObject] ){ // check if element contain attribut
                        // console.log(' 🔴 found element[currentObject]', currentObject , element[currentObject])
                        let attributsToRemoveFromObject = objectsAtributs[currentObject]
                        // console.log('🟢🔴 attributsToRemoveFromObject: ', attributsToRemoveFromObject, attributsToRemoveFromObject.length)
                        for (let indexObjectAttributs = 0; indexObjectAttributs < attributsToRemoveFromObject.length; indexObjectAttributs++) {
                            let currentObjectAttribut = attributsToRemoveFromObject[indexObjectAttributs]
                            // console.log('currentObjectAttribut: ', currentObjectAttribut)
                            // remove attribut 
                            delete element[currentObject][currentObjectAttribut]
                        }
                    }
                }
            }
            // console.log('newResult +++++++++++++++++++++++++++=: ', newResult)
            return resolve({
                status: true,
                resources: newResult
            })
        } catch (error) {
            console.log('error: ', error)
            reject({
                status: false,
                message: error
            })
        }
    });
};