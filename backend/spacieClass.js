// console.log("Enter spacieClass.js")
if(ret === undefined){
    console.log("undefined spacie class")
  }
var fs = require('fs');
class Spacie extends Character{
    constructor(name, jumpSquat){
        let isSpacie = true;  
        super(name, jumpSquat, isSpacie);  
    }
}

eval(fs.readFileSync('spacieMethods.js')+'');