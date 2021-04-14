// console.log("Enter namedCharacterClasses.js")
if(ret === undefined){
  console.log("undefined namedCharacterClass")
}
var fs = require('fs');

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
      let isSpacie = false
      let name = "Sheik"  
      let jumpSquat = 3;  
      super(name, jumpSquat, isSpacie);  
    }    
  }
    
  class Falcon extends Character{
    constructor(){ 
      let isSpacie = false
      let name = "Falcon"  
      let jumpSquat = 4;  
      super(name, jumpSquat, isSpacie); 
    }
  }  
    
  class Marth extends Character{
    constructor(){  
      let isSpacie = false
      let name = "Marth"
      let jumpSquat = 4;
      super(name, jumpSquat, isSpacie);
    }
  }

  eval(fs.readFileSync('namedCharacterMethods.js')+'');