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

var azurestorageURL = 'https://shareitfiles.blob.core.windows.net/quizcloudcontainer/';

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

router.get('/create', function(req, res, next) {
  res.render('create.pug', { fileurl:'', message: {text: ''} });
});

router.post('/login', function(req, res, next) {
  // query db
  var results = [];
  var query = "select * from Picture where filename='cat.jpg'";
  var request = new Request(query, function(err,rowcount,rows){
    if (err){
      console.log('error %o',err);
      var error = {
        text: 'Something went wrong. Try again later!', 
        style: 'alert alert-danger'
      };
      res.render('view.pug', { name: req.body.username, message: error });
    }
    console.log('rowcount = %o',rowcount);
    console.log('rows = %o',results);
    var filelink = azurestorageURL + encodeURIComponent(results[0].filename);
    console.log('filelink = '+filelink);
    res.render('view.pug', { fileurl: filelink, result: results[0] });
  });
  request.on('row', function(columns) {
    var row = {};
    columns.forEach(function(column) {
        console.log("%s\t%s", column.metadata.colName, column.value);
        row[column.metadata.colName] = column.value;
    });
    results.push(row);
  });
  db.execSql(request);
});

router.post('/create', multer.single('file1'), function (req, res, next) {
  console.log('filename : '+req.file.originalname);
  // Get fields in upload form
  var title = req.body.title;
  console.log('title = '+title);

  // Upload file1 to azure blob storage and the details to database
  azureblob.createBlockBlobFromStream('quizcloudcontainer', req.file.originalname, getStream(req.file.buffer), req.file.size, function(error, result, response){
    if(!error){
      // file uploaded
      console.log("%o", response);
      // Get file URL
      var filename = result.name;
      var filelink = azurestorageURL + encodeURIComponent(filename);
      var success = {
        text: 'File uploaded successfully!', 
        style: 'alert alert-success'
      };
      // Create a query to insert row
      var time = result.lastModified;
      var username = req.body.username;
      var year = req.body.year;
      var desc = req.body.desc;
      var query = "INSERT INTO PictureDetails(username, filename, year, description, time) VALUES('"+username+"','"+filename+"','"+year+"','"+desc+"','"+time+"')";
      var request = new Request(query, function(err,rowcount,rows){
        if (err){
          console.log('error %o',err);
          var error = {
            text: 'Something went wrong. Try again later!', 
            style: 'alert alert-danger'
          };
          res.render('create.pug', { name: req.body.username, message: error });
        }
        console.log(rowcount + ' row(s) returned');
        var success = {
          text: 'Inserted to DB successfully. Try sharing another one!', 
          style: 'alert alert-success'
        };
        res.render('create.pug', { name: req.body.username, message: success });
      });
      db.execSql(request);
    } else {
      console.error("error : %o", error);
      var msg = {
        text: 'Oops! Something went wrong!', 
        style: 'alert alert-danger'
      };
      res.render('create.pug', {message: msg});
    }
  });
});


function getStream(buffer){
  var stream = new Duplex();
  stream.push(buffer);
  stream.push(null);
  return stream;
}


router.get('/show', function(req, res, next) {
  console.log('b %o', req.body.action);
  var results = [];
  // Query all the photos shared by other users
  var query = "select * from PictureDetails";
  var request = new Request(query, function(err,rowcount,rows){
    if (err){
      console.log('error %o',err);
      var error = {
        text: 'Something went wrong. Try again later!', 
        style: 'alert alert-danger'
      };
      res.render('view.pug', { name: req.body.username, message: error });
    }
    console.log('rowcount = %o',rowcount);
    console.log('rows = %o',results);
    res.render('view.pug', { message:{text:''}, rows: results });
  });
  request.on('row', function(columns) {
    var row = {};
    columns.forEach(function(column) {
        console.log("%s\t%s", column.metadata.colName, column.value);
        row[column.metadata.colName] = column.value;
    });
    results.push(row);
  });
  db.execSql(request);
});

module.exports = router;
