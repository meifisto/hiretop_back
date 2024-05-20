'use strict';

const fs = require('fs');
const cloudinary = require('cloudinary').v2
const tmpDir = process.env.TMP_DIR
//cloudinary config
cloudinary.config({
  cloud_name: 'dfidd0bty', 
  api_key: '778917222714153', 
  api_secret: 'Ycc89YnBN4XaM3tkdkIzpLU3gOw' 
});

exports.uploadFile = (file) => {
  return new Promise(async function(resolve, reject) {
    //create tmp directory if not exist 
    // const tmpDir = "files/tmp/"
    if (!fs.existsSync(tmpDir)){
      fs.mktmpDirSync(tmpDir, { recursive: true });
    }
    // create file in disk
    fs.createWriteStream(tmpDir + file.hapi.filename).write(file._data);
    //upload in cloudinary
    await cloudinary.uploader.upload(tmpDir+file.hapi.filename, (error, result)=>{
      if(result){
        // console.log('result in cloudinary helper ::: ', result);
        //remove file
        try {
          fs.unlinkSync(tmpDir+file.hapi.filename)
        } catch(err) {
          console.error(err)
        }
        return resolve({
          statusCode: result.statusCode,
          result
        });
        //remove file
        removeFile(tmpDir+file.hapi.filename)
        // try {
        //   fs.unlinkSync(tmpDir+file.hapi.filename)
        // } catch(err) {
        //   console.error(err)
        // }
      }
      if(error){
        console.log('error in cloudinary helper: ',error)
        reject(error)
        //remove file
        try {
          fs.unlinkSync(tmpDir+file.hapi.filename)
        } catch(err) {
          console.error(err)
        }
      }
    });

      // const params = {
      //     Bucket: s3Options.bucket,
      //     Key: uuid.v4() + '.' + file.hapi.filename.split('.').pop(),
      //     Body: file._data
      // };

      // // Uploading files to the bucket
      // s3.upload(params, function(err, data) {
      //     if (err) {
      //         reject(err);
      //     }
      //     return resolve({
      //         statusCode: 200,
      //         location: data.Location
      //     });
      // });
  });
};

exports.removeFile = (path) => {
  try {
    fs.unlinkSync(path)
  } catch(err) {
    console.error(err)
  }
}