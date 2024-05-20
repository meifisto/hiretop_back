'use strict';

exports.breakObjects = (array ) => {
    return new Promise(async function(resolve, reject) {
        try {
            let newResult = []
            for (let index = 0; index < array.length; index++) {
                let element = JSON.parse(JSON.stringify(array[index]))
                let elementAttributs = Object.keys(element)
                // console.log('🩸 element: ', '🩸🩸🩸 attributs ', elementAttributs)

                for (let indexAttribut = 0; indexAttribut < elementAttributs.length; indexAttribut++) {
                    // console.log('elementAttributs[indexAttribut]: ', typeof element[elementAttributs[indexAttribut]])
                    if( typeof element[elementAttributs[indexAttribut]] === 'object' ){
                        // console.log( 'an object 🟢',  elementAttributs[indexAttribut], element[elementAttributs[indexAttribut]] )
                        
                        if(element[elementAttributs[indexAttribut]]){
                            
                            let attributsToBreak = Object.keys(element[elementAttributs[indexAttribut]])
                            // console.log('attributsToBreak: ', attributsToBreak);
                            
                            // map attribut to break 
                            for (let attributsToBreakIndex = 0; attributsToBreakIndex < attributsToBreak.length; attributsToBreakIndex++) {

                                // console.log('-----------🟢---------🟢--------')
                                const currentAttributToBreak = attributsToBreak[attributsToBreakIndex];
                                let newAttribut_1 = currentAttributToBreak.charAt(0).toUpperCase() + currentAttributToBreak.slice(1)
                                // console.log( ' >>> currentAttributToBreak: ', elementAttributs[indexAttribut],  currentAttributToBreak,  newAttribut_1 )
                                // element[elementAttributs[indexAttribut]][currentAttributToBreak]
                                let newAttribut_2 = elementAttributs[indexAttribut] + newAttribut_1
                                // console.log('newAttribut_2: --🟢----🟢-- ', newAttribut_2, element[elementAttributs[indexAttribut]][currentAttributToBreak] )
                                element[newAttribut_2] = element[elementAttributs[indexAttribut]][currentAttributToBreak]
                            }
                        }
                        // delete old object
                        delete element[elementAttributs[indexAttribut]]
                    }
                }

                newResult.push( element )

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

// exports.capitalizeFirstLetter = (string) => {
//     try {
//         return string.charAt(0).toUpperCase() + string.slice(1);
//     } catch(err) {
//         console.error(err)
//     }
// }