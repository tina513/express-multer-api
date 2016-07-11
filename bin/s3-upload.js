'use strict';

require('dotenv').config();

const  fs = require('fs');
const mongoose = require('../app/middleware/mongoose');
const Upload = require('../app/models/upload');
const uploader = require('../lib/aws-s3-upload.js');

let filename = process.argv[2] || '';
let comment = process.argv[3] || 'No comment';

const readFile = (filename) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, (err, data)=>{
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
};

readFile(filename)
.then(uploader.prepareFile)
.then(uploader.awsUpload)
.then((response) => {
  let upload = {
    location: response.Location,
    comment: comment, //not defined yet
  };
  return Upload.create(upload);
})
.then(console.log)
.catch(console.error)
.then(()=>mongoose.connection.close());
