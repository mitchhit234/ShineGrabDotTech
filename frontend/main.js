var bodyParser = require('body-parser');
var express = require('express');
var app = express();

app.use(express.static(__dirname + '/'));
//app.use(bodyParser.urlencoded({extend:true}));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', __dirname);

app.get('/start', function(req, res){
	var name = 'hello';
    res.render(__dirname + 'start.html', {name:name});
}).listen(8000);