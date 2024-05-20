// const { resolve } = require('path');
const MainHelper = require('../helpers');

exports.setterNotification = async(etablissementId, roleCode, notifGroup, notifTitle, notifText, objectId, schemaName, objectEditor) => {
  // console.log('\n \n',userId, roleCode,'\n \n')
  return new Promise(async(resolve, reject) => {
    //load role
    let role = await MainHelper['role'].list({code: roleCode});
    // console.log('role load: ', role)
    if(!role[0]._id){
      console.log('role introuvable')
      return reject(false)
      
    }
    role = role[0]
    // building notification
    let notif = {
      title: notifTitle,
      nom: notifText,
      id: objectId,
      read: false,
    }

    //load user(s)
    if(etablissementId){
      let user = null
      user = await MainHelper['admin'].list({etablissement: etablissementId, role: role._id})
      if(!user[0]._id){
        console.log('utilisateur introuvable')
        return reject(false)
      }
      user = user[0]
      if(schemaName) notif.scheme = schemaName
      if(objectEditor) notif.editor = objectEditor
      //check if user have notifications
      let userNotification = await MainHelper['notification'].list({utilisateur: user._id});
      if(userNotification.length === 0){
        let newNotification = {utilisateur: user.id}
        newNotification[notifGroup] = [ notif ]
        let createUserNotif = await MainHelper['notification'].create(newNotification);
        if(createUserNotif) {
          return resolve(true)
        }
        return reject(false)
      }else{
        userNotification = userNotification[0]
        //update user notifications
        let dataInNotifGroup = userNotification[notifGroup] || []
        dataInNotifGroup.push( notif )
        let updateUserNotif = await MainHelper['notification'].update(userNotification._id,{[notifGroup]: dataInNotifGroup});
        if(updateUserNotif) {
          return resolve(true)
        }
        return reject(false)
      }
    }else{
      let users = await MainHelper['admin'].list({role: role._id})
      let successSend = []
      if(users.length === 0){
        return reject(false)
      }
      if(schemaName) notif.scheme = schemaName
      if(objectEditor) notif.editor = objectEditor
      //set notifcations by user
      for(let i = 0; i < users.length; i++){
        //check if user have notifications
        let userNotification = await MainHelper['notification'].list({utilisateur: users[i]._id});
        if(userNotification.length === 0){
          let newNotification = {utilisateur: users[i]._id}
          newNotification[notifGroup] = [ notif ]
          let createUserNotif = await MainHelper['notification'].create(newNotification);
          if(createUserNotif) return resolve(true)
        }else{
          userNotification = userNotification[0]
          //update user notifications
          let dataInNotifGroup = userNotification[notifGroup] || []
          dataInNotifGroup.push( notif )
          let updateUserNotif = await MainHelper['notification'].update(userNotification._id,{[notifGroup]: dataInNotifGroup});
          if(updateUserNotif) return resolve(true)
        }
      }
      if(successSend.length === users.length) successCallback(true)
      else {
        return reject(false)
      }
    }
  })
}