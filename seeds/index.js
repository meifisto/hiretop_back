
const dotenv = require('dotenv')
dotenv.config()

const initDB = require('./db').initDB

const permissionsSeeder = require('./permissions.seed').run
const rolesSeeder = require('./roles.seed').run
const superAdminSeeder = require('./super-admin.seed').run
const secteursSeeder = require('./secteurs.seed').run
const typesEtablissementSeeder = require('./type-etablissement.seed').run
const faqSeeder = require('./faq.seed').run


async function runAll() {
    return new Promise(async (resolve, reject) => {
        const DB = await initDB()
        console.log('DB :>> ', DB);
        await faqSeeder()
        await typesEtablissementSeeder()
        await secteursSeeder()
        await permissionsSeeder()
        await rolesSeeder()
        await superAdminSeeder()
        resolve(true)
    })
}

runAll().then(e=>{
    console.log('✅ Succesfully run all seeds');
    process.exit(0)
})

module.exports = {
    runAll
}