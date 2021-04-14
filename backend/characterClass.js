console.log("Enter characterClass.js")
if(ret === undefined){
  console.log("undefined characterClass")
}
var fs = require('fs');
class Character{
  constructor(name, jumpSquat, isSpacie){
    this.jumpSquat = jumpSquat
    this.name = name
    this.techWindow = 20
    this.isSpacie = isSpacie
  }
}

eval(fs.readFileSync('characterMethods.js')+'');