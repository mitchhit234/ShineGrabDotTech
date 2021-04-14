// console.log("Enter characterMethods.js")
if(ret === undefined){
  console.log("undefined characterMethods")
}
var fs = require('fs');
  Character.prototype.getJumpSquat = function(){
    return this.jumpSquat;
  }
  Character.prototype.getTechWindow = function(){
    return this.techWindow;
  }
  Character.prototype.getName = function(){
    return this.name;
  }
  Character.prototype.getSpacie = function(){
    return this.isSpacie;
  }
  Character.prototype.getNextFrameAction = function(frame) {
    if(frame > GAME_END){
      frame = GAME_END
      return frame
    }
  
    var startAction = frames[frame].players[playerIndex]['post']['actionStateId']
    
    while(frames[frame].players[playerIndex]['post']['actionStateId'] == startAction) {
      frame++;
      if(frame > GAME_END){
        frame = GAME_END
        return frame
      }
    }
    return frame
  }
  Character.prototype.waveDashes = function(startFrame){
    var nextFrameAction = this.getNextFrameAction(startFrame)
    waveDashTiming = nextFrameAction - startFrame;
    var badTiming = false 
    var nextAction = frames[nextFrameAction].players[playerIndex]['post']['actionStateId']
    var goodTiming = this.getJumpSquat()+1
    if(nextAction == AIRDODGE || nextAction == LANDINGFALLSPECIAL){
      if(waveDashTiming > goodTiming){
        badTiming = true
        console.log("HAS BAD TIMING " + (nextFrameAction + 123))
      }
    }
    else{
      nextFrameAction = this.checkJumps(startFrame)
      nextAction = frames[nextFrameAction].players[playerIndex]['post']['actionStateId']
      waveDashTiming = nextFrameAction - startFrame;
      if(nextAction == AIRDODGE || nextAction == LANDINGFALLSPECIAL){
        if(waveDashTiming > goodTiming){
          badTiming = true
        }
      }
      wavedashes.push(new Wavedash(nextFrameAction+123, !badTiming))
    }
    if(badTiming!=true){
      goodWaveDashes++
    }
  
  
    return [badTiming, nextFrameAction]
  }
  Character.prototype.checkJumps = function(startFrame){
    var nextFrameAction = this.getNextFrameAction(startFrame)
    var nextAction = frames[nextFrameAction].players[playerIndex]['post']['actionStateId']
  
    if(nextAction == JUMPF || nextAction == JUMPB) {
      nextFrameAction = this.getNextFrameAction(nextFrameAction)
      nextAction = frames[nextFrameAction].players[playerIndex]['post']['actionStateId']
    }
    return nextFrameAction;
  }
  Character.prototype.determineTechCase = function(techCase, startFrame){
    if(techCase == -1){
      console.log("Pressed Tech too Early on missed tech at frame " + (startFrame + 123))
      return techCase;
    }else if( techCase == 0){
      console.log("Never Pressed Tech on missed tech at frame " + (startFrame + 123))
      return techCase;
    }else if (techCase == 1){
      console.log("Pressed Tech Too Late on missed tech at frame " + (startFrame + 123))
    }
  }
  Character.prototype.missedTech = function(startFrame){
    var nextFrameAction = this.getNextFrameAction(startFrame)
    currentTechWindow = nextFrameAction - startFrame;
    var possibleTech = startFrame - this.getTechWindow();
    var missedTech = false
    var currentAction = frames[startFrame].players[playerIndex]['post']['actionStateId']
    var techCase = 0;
    var techFrame = 0;
  
    if(currentAction == MISSED_TECH_DOWN || currentAction == MISSED_TECH_UP){
      missedTech = true;
    }
    var frame;
    if( missedTech == true){
      for(frame = (startFrame - (this.getTechWindow() * 2)); frame< (startFrame + this.getTechWindow()); frame++){
        if(frames[frame].players[playerIndex]['pre']['trigger'] == 1){
          if(frame < possibleTech){
            techCase = -1 // pressed tech too early, before base case 
            techFrame = frame
          }
          else if(frame > startFrame){
            techCase = 1 // pressed tech too late, after base case
            techFrame = frame
          }
          else{
            techFrame = frame
          }
        }
      }
    }
  
  //this.determineTechCase(techCase, startFrame)
  return [techFrame+123,techCase] // adjust for the slippi video
  
  }
  Character.prototype.jcGrab = function(startFrame) {
    var isGrab = false
    var nextFrameAction = this.getNextFrameAction(startFrame)
    var nextAction = frames[nextFrameAction].players[playerIndex]['post']['actionStateId']
    var grabWindow = nextFrameAction - startFrame // The number of frames to skip
    var isPerfect = false
    if(nextAction == GRAB) {
      isGrab = true
      // acceptable window for a good shine grab
      if(grabWindow <= (this.getJumpSquat-1)) {
        isPerfect = true
      }
    }
    else {
      // If the next action is jump forward, skip it because we dont care
      nextFrameAction = this.checkJumps(startFrame)
      nextAction = nextAction = frames[nextFrameAction].players[playerIndex]['post']['actionStateId']
        if(nextAction == NAIR) {
          isGrab = true // still counts as a grab attempt
          isPerfect = false
        }
    }
    return [isGrab, isPerfect]
  }
  

eval(fs.readFileSync('spacieClass.js')+'');