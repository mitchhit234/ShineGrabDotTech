var fs = require('fs');
const { settings } = require('cluster');
const { default: SlippiGame } = require('@slippi/slippi-js');
const { get } = require('https');
const { setPriority } = require('os');

// Including functions for reading, parsing, and
// searching for action states 
eval(fs.readFileSync('readActionState.js')+'');


//READING FUNCTIONALITY  
let express = require("express"),
ejs = require('ejs'),
app = express(),
path = require('path'),
multer = require('multer');

app.set('view engine', 'ejs'); // code to set the ejs for rendering template
app.use('/views/', express.static('./views'));


//Used in posting the correct page later
var count = 0;

 
let storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/views/uploads")
    },
    filename: function(req, file, callback) {
        console.log(file)
        callback(null, "temp.slp")
    }
   })
 
   app.get('/', function(req, res) {
    if(count % 2 == 0){      
      res.render('pages/read')
      count++;
    }
    else{
      var ret = req.originalUrl;
      ret = ret.slice(-1);

      eval(fs.readFileSync('main.js')+'');

      setPort(ret);

      var shinegrabs = getShineGrabs();
      console.log(shinegrabs);
      console.log(getNeutralWins());
      console.log(getWaveDashNum());

<<<<<<< HEAD
      res.render('pages/index');
=======
      //var shinegrabs = getShineGrabs();
      //console.log(shinegrabs);
      res.render('pages/index', {
        
      });
>>>>>>> a0f29eb899a927bcee3947d84e9a386a971eed11
      count++;
    }
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

      var name = 'Pick Your Character';

      const game = new SlippiGame("views/uploads/temp.slp");
      const settings = game.getSettings();

      var char1 = getCharacterNames(settings.players[0]['characterId']);
      var char2 = getCharacterNames(settings.players[1]['characterId']);

      res.render('pages/start', {
          name: name,
          char1: fileReadable(char1),
          char2: fileReadable(char2)})   
      
      app.post('/', function(req, res) {
          console.log("did it");
      });
      
       
    })
  })
   let host_port = process.env.PORT || 3000
   app.listen(host_port, function() {
    console.log('Node.js listening on port ' + host_port);
   })
//END READING FUNCTIONALITY