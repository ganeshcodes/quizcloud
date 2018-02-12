var express = require('express');
var router = express.Router();
var azure = require('azure-storage');
var Duplex = require('stream').Duplex;  
var db = require('../lib/db');
var Request = require('tedious').Request;

var azureblob = azure.createBlobService(
  'shareitfiles',
  'hL1Q5vOz5XSlJ5FCyNHHJLQDKcVVzeRJfADE4Z4JfG/lvLZL0W8IunpTbfDFHADKaik99nNqucUOuXulFw3a0A=='
)

var azurestorageURL = 'https://shareitfiles.blob.core.windows.net/shareitcontainer/';

// [START multer]
const Multer = require('multer');
const multer = Multer({
    storage: Multer.MemoryStorage,
    limits: {
        fileSize: 5 * 1024 * 1024 // no larger than 5mb
    }
});
// [END multer]

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Quiz 2 Cloud' });
});

router.get('/test', function(req, res, next) {
  res.send('Hello test');
});

function getStream(buffer){
  var stream = new Duplex();
  stream.push(buffer);
  stream.push(null);
  return stream;
}

module.exports = router;
