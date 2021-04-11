const { settings } = require('cluster');
var fs = require('fs');

// Including functions for reading, parsing, and
// searching for action states 

let express = require("express"),
ejs = require('ejs'),
app = express(),
path = require('path'),
multer = require('multer');

app.set('view engine', 'ejs'); // code to set the ejs for rendering template
app.use('/views/', express.static('./views'));
 
let storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/views/uploads")
    },
    filename: function(req, file, callback) {
        console.log(file)
        callback(null, file.originalname)
    }
   })
 
   app.get('/', function(req, res) {
    res.render('pages/read')
   })
 
  app.post('/', function(req, res) {
    let upload = multer({
        storage: storage,
        fileFilter: function(req, file, callback) {
            let ext = path.extname(file.originalname)
            callback(null, true)
        }
    }).single('userFile');
    upload(req, res, function(err) {

      var name = "test";

      res.render('pages/start', {
          name: name,
          char1: 'fox',
          char2: 'falco'})
        
    })
  })
   let port = process.env.PORT || 3000
   app.listen(port, function() {
    console.log('Node.js listening on port ' + port);
   })