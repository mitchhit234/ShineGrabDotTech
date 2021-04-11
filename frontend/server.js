// load the things we need
var express = require('express');
var app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');
app.use('/views/', express.static('./views'));

// index page 
app.get('/', function(req, res) {
    var name = "test";
    //views/...
    res.render('pages/start', {
        name: name,
        char1: "falco",
        char2: "fox"})
});

app.listen(8080);