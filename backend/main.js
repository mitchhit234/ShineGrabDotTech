// YO: SLIPPI REPLAY PARSER INDEXES AT 0 BUT SLIPPI.JS INDEXES AT -123

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
const NAIR = getActionStateID(foxIDs, 'AttackAirN');
const JUMPF = getActionStateID(foxIDs, 'JumpF');


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
var shinegrabs= new Array(); // array of shinegrabs

// iterate through future frames until new action is found
function setPort(portNum){
  port = portNum;
}
function getNextFrameAction(frame) {
  var startAction = frames[frame].players[port]['post']['actionStateId']
  while(frames[frame].players[port]['post']['actionStateId'] == startAction) {
    frame++;
  }
  return frame
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
    // good shine grab!
    if(isShineGrab[0,1] != false) {
      shinegrabs.push(["Successful shine grab attempt at frame ",MAFF]);
    } 
    // Slow jump
    else if(isShineGrab[1,1] == false) {
      shinegrabs.push(["Shine grab attempt was too late (nair'd) at frame ",MAFF]);
    }
    // Nair'd instead 
    else if(isShineGrab[0,1] == false) {
      shinegrabs.push(["Successful shine grab attempt, but late jump at frame ",MAFF]);
    }
  }
}

var frame;
for(frame=GAME_START;frame<GAME_END;frame++) {
  if(frames[frame].players[port]['post']['actionStateId'] == SHINE){
    // call shinegrab
    shineGrab(frame)
    frame = frame + window
  }
}
for(var i =0; i < shinegrabs.length; i++) {
  console.log(shinegrabs[i][0]+shinegrabs[i][1])
}