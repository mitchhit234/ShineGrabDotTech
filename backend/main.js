var fs = require('fs');

// Including functions for reading, parsing, and
// searching for action states 
eval(fs.readFileSync('readActionState.js')+'');

// Including Slippi API for reading .slp files
const { default: SlippiGame } = require('@slippi/slippi-js');
const game = new SlippiGame("testing/shinegrab.slp");

// Shine = 'Reflector Ground Loop' (fox only)
// Jump Squat = 'KneeBend'
// Grab = 'Catch'
// Check fox.txt for rest, up to 340 is universal
foxIDs = readCharacterActionState('fox');
const SHINE = getActionStateID(foxIDs, 'Reflector Ground Loop');
const JUMP_SQUAT = getActionStateID(foxIDs, 'KneeBend');
const GRAB = getActionStateID(foxIDs, 'Catch');


// *lastFrame* gives the total number of frames in the
// game (not including -123 to 0 before players can act)
const meta_data = game.getMetadata();
const GAME_END = meta_data.lastFrame;

// This will contain most of our data for tech skill analysis
// All slippi game files start on frame -123 (before GO leaves screen)
const frames = game.getFrames()
const GAME_START = -123

// *players[i]['characterid']* gives us the character ID
// given by the last column in the google spreadsheet 
// *players[i].controllerFix* returns UCF if ucf is active
// *stageID* returns stage ID given by google spreadsheet
const settings = game.getSettings();

// Overall and Stocks have a lot of information that will be useful
const stats = game.getStats();

// *[i].airDodgeCount, dashDanceCount, ledgegrabCount,
// rollCount, spotDodgeCount, waveDashCount, wavelandCount
const actionCounts = stats.actionCounts;

// Lots of stuff here, basically a list of all combos in the game 
// in order with stats for percentages, frames, moves. etc.
const combos = stats.combos;

// Basically combo list extended, with more information like 
// openingType (neutral wins), 
const conversions = stats.conversions;

// iterate through future frames until new action is found
function getNextFrameAction(frame) {
  var startAction = frames[frame].players[0]['post']['actionStateId']
  while(frames[frame].players[0]['post']['actionStateId'] == startAction) {
    frame++;
  }
  return frame
}

// shinejump function
function shineJump(startFrame,isPerfect) {
  var isShineJump = false
  var nextFrameAction = getNextFrameAction(startFrame)
  var nextAction = frames[nextFrameAction].players[0]['post']['actionStateId']
  if(nextAction == JUMP_SQUAT) {
    isShineJump = true
    // acceptable window for a good shine grab
    if(nextFrameAction - startFrame <= 3) {
      isPerfect = true
      console.log("perfect shine jump")
    }
    else {
      isPerfect = false
      console.log("sucky shine jump")
    }
  }
}
// jc grab function
// shine grab
function shineGrab(startFrame) {
  isPerfect = false
  // call shinejump
  return shineJump(startFrame, isPerfect)
  /// call jc grab
}

var frame;
for(frame=GAME_START;frame<GAME_END;frame++) {
  if(frames[frame].players[0]['post']['actionStateId'] == SHINE){
    // call shinegrab
    shineGrab(frame)
    frame = frame + 4
  }
}