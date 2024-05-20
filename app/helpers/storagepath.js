const dotenv = require('dotenv')
dotenv.config()

const path = require('path')
const fs = require('fs')


const OsHomeDir = require('os').homedir();

const pathFromEnv = process.env.filesStoragePath +''

// const filesStoragePath = path.join(OsHomeDir, pathFromEnv)
const filesStoragePath = 'files/store/'


// console.log('OsHomeDir :>> ', filesStoragePath);

module.exports = {
    filesStoragePath
}