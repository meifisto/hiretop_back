
const dotenv = require('dotenv')
const moment = require('moment')
const fs = require('fs');
dotenv.config()

const backupDir = './database_backup'
const uri = process.env.ENVIRONMENT === 'DEV' ? process.env.DATABASE_URL_DEV : process.env.DATABASE_URL_PROD
const frequence = '*/50 * * * *' //59 23 * * *
const maxIteration = 5


const cron = require('node-cron'), spawn = require('child_process').spawn;
async function run() {
    return new Promise(async (resolve, reject) => {
        //create tmp directory if not exist 
        if (!fs.existsSync(backupDir)){
            fs.mkdirSync(backupDir, { recursive: true });
        }
        let index = 0
        let currentDate = moment().format('DD-MM-YY HH:mm:ss')

        let task = cron.schedule(frequence, () => {
            index += 1
            // -------------------------------- current backup
            let backupProcess = spawn('mongodump', [
                `--uri=${uri}`,
                '-o=./'+backupDir+'/'+currentDate+'/',
                '--gzip'
                ]);
            
            backupProcess.on('exit', (code, signal) => {
                if(code) 
                    console.log(' ❌ Backup process exited with code ', code);
                else if (signal)
                    console.error(' ❌ Backup process was killed with singal ', signal);
                else 
                    console.log('✅ Save new backup ------ ', currentDate)
            });

            // -------------------------------- drop file in backup 
            fs.readdir( backupDir, (error, files) => {
                if(files.length > maxIteration){
                    let countToDrop = files.length - maxIteration
                    // console.log('countToDrop: ', countToDrop)
                    for (let index = 0; index < countToDrop; index++) {
                        const element = countToDrop[index];
                        if(files[index]){
                            try {
                                let currentPath = backupDir+'/'+files[index]
                                try {
                                    fs.rmSync(currentPath, { recursive: true, force: true })    
                                    console.log('⭕️ Drop old backup ------ ', files[index])
                                } catch (error) {
                                    console.log('error: ', error)
                                }
                            } catch (error) {
                                console.log('error: ', error)
                            }
                        }
                    }
                }
            });

            resolve(true)
        });
    })
}

run().then(result => {
    // console.log('result: ', result)
    console.log('Succesfully launch backup process ✅')
})

module.exports = {
    run
}