'use strict';

require('dotenv').config();

const  fs = require('fs');
const fileType = require('file-type');
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRTE_ACCESS_KEY,
  }
});

const mimeType = (data) => {
  return Object.assign({
    ext: 'bin',
    mime: 'application/octet-stream',
  },fileType(data));
};

let filename = process.argv[2] || '';

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

const awsUpload = (file) => {
  const options = {
    ACL: "public-read",
    Body: file.data,
    Bucket: 'wdibucket',
    ContentType: file.mime,
    Key: `test/test.${file.ext}`
  };

  return new Promise((resolve, reject)=>{
      s3.upload(options, (error, data)=>{
        if (error) {
          reject(error);
        }

        resolve(data);
      });
  });

  // return Promise.resolve(options);
};

readFile(filename)
.then((data) => {
  let file = mimeType(data);
  file.data = data;
  return file;
})
.then(awsUpload)
.then(console.log)
.catch(console.error);
