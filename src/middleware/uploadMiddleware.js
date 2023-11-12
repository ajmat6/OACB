const multer = require('multer'); // importing multer to upload files
const shortid = require('shortid'); // to create a short id of the file uploaded
const path = require('path');

// to read files uploaded using multer as files uploaded using multer are not readable(taken from docs)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(path.dirname(__dirname), 'uploads')) // destination folder path using path.join
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, shortid.generate() + '-' + file.originalname) // short id will generate some random name for the file uploaded which will be suffixed by the file.originalname that is received in the req.file
    }
});

// const upload = multer({ dest: 'uploads/' }) // dest contains the destination directory of the uploaded files (files kaha save hogi) and this will create uploads folder automatically
const upload = multer({ storage }); // the destination of the storage is defined in the storage function

module.exports = upload