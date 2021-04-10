// YO: SLIPPI REPLAY PARSER INDEXES AT 0 BUT SLIPPI.JS INDEXES AT -123

var fs = require('fs');

// Including functions for reading, parsing, and
// searching for action states 
eval(fs.readFileSync('readActionState.js')+'');

// Including Slippi API for reading .slp files
const { default: SlippiGame } = require('@slippi/slippi-js');
const game = new SlippiGame("testing/techtest.slp");

// Shine = 'Reflector Ground Loop' (fox only)
// Jump Squat = 'KneeBend'
// Grab = 'Catch'
// Check fox.txt for rest, up to 340 is universal
foxIDs = readCharacterActionState('fox');
const SHINE = getActionStateID(foxIDs, 'Reflector Ground Loop');
const JUMP_SQUAT = getActionStateID(foxIDs, 'KneeBend');
const GRAB = getActionStateID(foxIDs, 'Catch');
const NAIR = getActionStateID(foxIDs, 'AttackAirN');
const JUMPF = getActionStateID(foxIDs, 'JumpF');
const MISSED_TECH_UP = getActionStateID(foxIDs, 'DownBoundU');
const MISSED_TECH_DOWN = getActionStateID(foxIDs, 'DownBoundD')
const NEUTRAL_TECH = getActionStateID(foxIDs, 'Passive')


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

var port = 0;

var window = 0; // current action window size
var currentTechWindow = 0;



//Default Actions

function setPort(portNum){
  port = portNum;
}
// iterate through future frames until new action is found
function getNextFrameAction(frame) {
  var startAction = frames[frame].players[port]['post']['actionStateId']
  while(frames[frame].players[port]['post']['actionStateId'] == startAction) {
    frame++;
  }
  return frame
}
function hitTech(startFrame){
  var nextFrameAction = getNextFrameAction(startFrame)
  currentTechWindow = nextFrameAction - startFrame;
  const TECHWINDOW = 20;
  var hitTech = false
  var currentAction = frames[startFrame].players[port]['post']['actionStateId']
  if(currentAction == NEUTRAL_TECH){
    hitTech = true;
  }
  var frame

  if(hitTech == true){
    for(frame = (startFrame - (TECHWINDOW * 2)); frame< (startFrame + TECHWINDOW); frame++){
      console.log(frames[88].players[port]['pre'])
    }
  }
}
function missedTech(startFrame){
  var nextFrameAction = getNextFrameAction(startFrame)
  currentTechWindow = nextFrameAction - startFrame;
  const TECHWINDOW = 20;
  var missedTech = false
  var currentAction = frames[startFrame].players[port]['post']['actionStateId']

  if(currentAction == MISSED_TECH_DOWN || currentAction == MISSED_TECH_UP){
    missedTech = true;
  }
  var frame;
  if( missedTech == true){
    for(frame = (startFrame - (TECHWINDOW * 2)); frame< (startFrame + TECHWINDOW); frame++){
      //console.log(frames[frame].players[port]['pre']['physicalLTrigger'] + " at frame: " + frame)
      console.log(frames[88].players[port]['pre'])
    }
  }

  }


// shinejump function
function shineJump(startFrame,isPerfect) {
  var isShineJump = false
  var nextFrameAction = getNextFrameAction(startFrame)
  var nextAction = frames[nextFrameAction].players[port]['post']['actionStateId']
  window = nextFrameAction - startFrame // The number of frames to skip
  if(nextAction == JUMP_SQUAT) {
    isShineJump = true
    // acceptable window for a good shine grab
    if(nextFrameAction - startFrame <= 3) {
      isPerfect = true
    }
    else {
      isPerfect = false
    }
  }
  return [isShineJump,isPerfect]
}
// jc grab function
function jcGrab(startFrame) {
  var isGrab = false
  var nextFrameAction = getNextFrameAction(startFrame)
  var nextAction = frames[nextFrameAction].players[port]['post']['actionStateId']
  var grabWindow = nextFrameAction - startFrame // The number of frames to skip
  if(nextAction == GRAB) {
    isGrab = true
    // acceptable window for a good shine grab
    if(grabWindow <= 2) {
      isPerfect = true
    }
  }
  else {
    // If the next action is jump forward, skip it because we dont care
    if(nextAction == JUMPF) {
      nextFrameAction = getNextFrameAction(nextFrameAction)
      nextAction = frames[nextFrameAction].players[port]['post']['actionStateId']
      if(nextAction == NAIR) {
        isGrab = true // still counts as a grab attempt
        isPerfect = false
      }
    }
  }
  return [isGrab, isPerfect]
}

// shine grab
function shineGrab(startFrame) {
  isPerfect = false
  // call shinejump
  var isShineGrab = shineJump(startFrame, isPerfect) && jcGrab(startFrame+window)
  // 0 index idicates if shinegrab is successful
  if(isShineGrab[0]) {
    var MAFF = startFrame+123
    if(isShineGrab[0,1] != false) 
      console.log("SHINE GRAB POGGAR!!! at " + MAFF)
    else if(isShineGrab[0,1] == false) 
      console.log("nair'd at " + MAFF)
      else if(isShineGrab[1,1] == false) 
      console.log("slow jump at " + MAFF)
  }
}
console.log(frames[88].players[port]['post']['actionStateId'])
console.log(frames[268].players[port]['post']['actionStateId'])
console.log(NEUTRAL_TECH + " neutral")

//console.log(frames[88].players[port]['pre'])

var frame;
for(frame=GAME_START;frame<GAME_END;frame++) {
  if(frames[frame].players[port]['post']['actionStateId'] == MISSED_TECH_DOWN || frames[frame].players[port]['post']['actionStateId'] == MISSED_TECH_UP){
    //console.log(frame + " frame action state" + frames[frame].players[port]['post']['actionStateId'])
    frame = frame + currentTechWindow
    //missedTech(frame)
  }
  else if(frames[frame].players[port]['post']['actionstateId'] == NEUTRAL_TECH){
    console.log(frame + " frame action state" + frames[frame].players[port]['post']['actionStateId'])
    frame = frame + currentTechWindow
    hitTech(frame)
  }
  else if(frames[frame].players[port]['post']['actionStateId'] == SHINE){
    // call shinegrab
    shineGrab(frame)
    frame = frame + window
  }
}