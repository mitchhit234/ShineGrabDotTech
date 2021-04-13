console.log("Enter characterClass.js")
var fs = require('fs');
class Character{
  constructor(name, jumpSquat){
    this.jumpSquat = jumpSquat
    this.name = name
    this.techWindow = 20
  }
}

class Spacie extends Character{
}

class Fox extends Spacie{
  constructor(){
    let name = "Fox"
    let jumpSquat = 3;
    super(name, jumpSquat);
  }    
}
  
class Falco extends Spacie{
  constructor(){
    let name = "Falco"
    let jumpSquat = 5;
    super(name, jumpSquat);
  }    
}
  
class Sheik extends Character{
  constructor(){
    let name = "Sheik"  
    let jumpSquat = 3;  
    super(name, jumpSquat);  
  }    
}
  
class Falcon extends Character{
  constructor(){ 
    let name = "Falcon"  
    let jumpSquat = 4;  
    super(name, jumpSquat);  
  }
}  
  
class Marth extends Character{
  constructor(){  
    let name = "Marth"
    let jumpSquat = 4;
    super(name, jumpSquat);
  }
}
eval(fs.readFileSync('characterMethods.js')+'');