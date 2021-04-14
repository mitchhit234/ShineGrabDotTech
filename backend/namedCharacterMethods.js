console.log("Enter namedCharacterMethods.js")
if(ret === undefined){
    console.log("undefined namedCharacterMethods")
  }
var fs = require('fs');

//Named Character Methods go here
eval(fs.readFileSync('main.js')+'');