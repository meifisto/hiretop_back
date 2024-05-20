'use strict';
const MailSender = require('./mailsender');
const Notification = require('./notification');
const MainHelper = require('../helpers');

const async = require('async');
// const asyncify = require('async/asyncify.js');

// const { type } = require('joi/lib/types/object');
// const { method } = require('lodash');
exports.queue = async.queue( async (task, completed) => {
  const {action, data} = task
  let results = []
  console.log('-------------🟢---🟢----🟢------------');
  console.log("Currently Busy Processing Task 👻  " + action, data);
  // ---------------------------------------------------------------------------------
  if (action == 'sendMail'){
    const { receiver, receiverFullname, subject, text, htmlText, buttonShow, buttonText, buttonLink, attachedFile, attachedFileName, sav, savInfos } = data
    // ---------------------- set notif
    const promise = await MailSender.sendMail(receiver, receiverFullname, subject, text, htmlText, buttonShow, buttonText, buttonLink, attachedFile, attachedFileName, sav, savInfos);
    // save mail in base 

    
    // console.log('promise: send mail --- ', promise);
    if(promise){
      console.log('===== mail send ✅ =====')
    }else{
      console.log('======= mail not send ❌ ======== ')
    }
    completed(null, {action, results});
  }
}, 1);