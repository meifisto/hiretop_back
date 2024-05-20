'use strict';
const dotenv = require('dotenv')
dotenv.config()

const Manifest = require('./config/manifest');
const Glue = require('glue');

const express = require('express');
const app = express();
let path = require('path');
app.use(express.static( path.join(__dirname, 'files') ));

const composeOptions = {
  relativeTo: __dirname
};

const launchBackup = require('./backup/index');
// const launchSeed = require('./seeds/index');

const NotificationSlack = require("./app/helpers/notification_slack");

async function startServer() {
  try {
    var server = await Glue.compose(Manifest.get('/'), composeOptions);
    await server.start();
    console.info(`Server started at ${server.info.uri} 🚀`);
    // launchSeed.runAll()
    launchBackup.run()

    // Intercepter les réponses et vérifier les erreurs 500
    server.ext('onPreResponse', (request, h) => {
      const response = request.response;
      
      const status_code_errors = [400,402,403,404,405,406, 500,501,502,503]
      if (status_code_errors.includes(response.statusCode)) {
        const msg = response.request.raw.req.method + 
                    ' : ' +  response.request.url.href + 
                    '\n' + response.source.message
        NotificationSlack.send_log(msg)
      }

      return h.continue;
    });


  } catch (err) {
    console.log("************************")
    console.error(err);
    process.exit(1);
  }
}

startServer();