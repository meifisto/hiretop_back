const Mongoose = require('mongoose');
const { resolve } = require('path');


const roleModel = require('../app/models/role.js')
const adminModel = require('../app/models/admin.js')



exports.run = async function () {
    const { email, password, firstname, lastname } = require('./superAdmin.json')
    const superAdminExist = await adminModel.findOne({ email })
    console.log('superAdminExist :>> ', superAdminExist);
    if (superAdminExist) {
        console.error('Super Admin account already exist. Skip seed');
        return
    }

    const role = await roleModel.findOne({ code: 'super_admin' }, { _id: 1 })
    console.error('Creating super admin account');
    const superAdmin = {
        email, password,
        firstname, lastname,
        role: role._id,
        isConfirmEmail: true,
    }
    const insertRequest = await adminModel.create(superAdmin)
    console.log('super admin account created succesfully :>> ', insertRequest);
    // console.log('existingItems :>> ', existingItems);  
}





