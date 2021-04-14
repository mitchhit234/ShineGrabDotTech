console.log("Enter spacieClass.js")
if(ret === undefined){
  console.log("undefined spacieMethods")
}
var fs = require('fs');
Spacie.prototype.shineJump = function(startFrame,isPerfect) {
    var isShineJump = false
    var nextFrameAction = this.getNextFrameAction(startFrame)
    var nextAction = frames[nextFrameAction].players[playerIndex]['post']['actionStateId']
    window = nextFrameAction - startFrame // The number of frames to skip
    if(nextAction == JUMP_SQUAT) {
      isShineJump = true
      // acceptable window for a good shine grab
      if(nextFrameAction - startFrame <= this.getJumpSquat()) {
        isPerfect = true
      }
      else {
        isPerfect = false
      }
    }
    return [isShineJump,isPerfect]
}
Spacie.prototype.shineGrab = function(startFrame) {
    var isPerfect = false
    // call shinejump
    var isShineGrab = this.shineJump(startFrame, isPerfect) && this.jcGrab(startFrame+window)
    // 0 index idicates if shinegrab is successful
    if(isShineGrab[0]) {
      var adjustedFrame = startFrame+123
      // good shine grab!
      if(isShineGrab[0,1] != false) {
        shinegrabs.push(new ShineGrab(adjustedFrame,true,true,true))
      } 
      // Slow jump
      else if(isShineGrab[1,1] == false) {
        shinegrabs.push(new ShineGrab(adjustedFrame,true,false,true))
      }
      // Nair'd instead 
      else if(isShineGrab[0,1] == false) {
        shinegrabs.push(new ShineGrab(adjustedFrame,true,false,false))
      }
    }
  
}


  eval(fs.readFileSync('namedCharacterClasses.js')+'');