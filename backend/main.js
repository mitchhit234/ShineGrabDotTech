// YO: SLIPPI REPLAY PARSER INDEXES AT 0 BUT SLIPPI.JS INDEXES AT -123

var fs = require('fs');
const { settings } = require('cluster');
const { default: SlippiGame, ConsoleConnection } = require('@slippi/slippi-js');
const { get } = require('https');

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

var port = 0;



// Including functions for reading, parsing, and
// searching for action states 
eval(fs.readFileSync('readActionState.js')+'');

//const game = new SlippiGame("views/uploads/temp.slp");
const game  = new SlippiGame("testing/Fox/sfat_s2j.slp")

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
const JUMPB = getActionStateID(foxIDs, 'JumpB');

//Techs
const MISSED_TECH_UP = getActionStateID(foxIDs, 'DownBoundU');
const MISSED_TECH_DOWN = getActionStateID(foxIDs, 'DownBoundD')
const NEUTRAL_TECH = getActionStateID(foxIDs, 'Passive')
const FORWARD_TECH = getActionStateID(foxIDs, 'PassiveStandF')
const BACK_TECH = getActionStateID(foxIDs, 'PassiveStandB')

//Airdodges
const AIRDODGE = getActionStateID(foxIDs, 'EscapeAir')
const LANDINGFALLSPECIAL = getActionStateID(foxIDs, 'LandingFallSpecial')



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
//const settings = game.getSettings();

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


var window = 0; // current action window size
var techOpportunities = 0;
var hitTechs = 0;
var currentTechWindow = 0;
var goodWaveDashes = 0
var waveDashCount = 0
var waveDashTiming = 0


//Read in Charatcer Tips
function getTips(char) {
  try {
    var fileName = 'assets/' + char + '_tips.txt';
    var data = fs.readFileSync(fileName, 'utf8');
    var stateIDs = splitLines(data); 
    return stateIDs;   
  } catch(e) {
    console.log('Error:', e.stack);
  }
}


//Default Actions
function ShineGrab(frameStart, successful, isPerfectJump, isPerfectGrab) {
  this.frameStart = frameStart;
  this.successful = successful;
  this.isPerfectJump = isPerfectJump;
  this.isPerfectGrab = isPerfectGrab;
}

function Tech(frameStart, techCase) {
  this.frameStart = frameStart;
  this.techCase = techCase;
}

function Wavedash(frameStart, isGoodDash) {
  this.frameStart = frameStart;
  this.isGoodDash = isGoodDash;
}

var shinegrabs = new Array(); // array of shinegrabs
var wavedashes = new Array(); 
var techs = new Array(); 




//Character Class

//Make sure if you're testing the different characters and classes, you go down to the driver function (the loop at the bottom), and uncomment out
//which character you want to test at what time.
//So if you want to test falco WD output, go down to the bottom and uncomment out falco.waveDashes(frame)

//Class Character is the base class that all individual characters will inherit.
  //Character has access to any and every method and variable that all different melee characters have.
  //These are things like jumpsquat, name, tech window, jump cancel grab. These are all things that every melee character has access to.

//Class Spacie inherits Character class, and Fox and Falco will inherit Spacie.
  //Spacie has access to every method that both Fox and Falco have access to and no one else. Things like Shinegrab, Waveshine, Jump out of Shine.
  //Pretty much anything to do with shine will end up going into the Spacie class.

//Class Fox and Class Falco will inherit the Spacie class
  //Class Fox and Class Falco will contain things that only that particular space animal have access to that the other doesn't.
  //Think standing double laser with fox, or Waveshine Upsmash (falco has this but it's like never used, not worth tracking), or double laser from ledge.

//Class {Character} will inherit the Character class.
  //For all other characters that aren't Fox or Falco, they will just inherit the Character class straight up.
  //Within each individual {Character}'s class, will contain things that only that character can do.
  //Think Falcon gentleman, marth chaingrab on fox, whatever we want.


class Character{
  constructor(name, jumpSquat){
    this.jumpSquat = jumpSquat
    this.name = name
    this.techWindow = 20
  }
  getJumpSquat(){
    return this.jumpSquat;
  }
  getTechWindow(){
    return this.techWindow;
  }
  getName(){
    return this.name;
  }
  getJumpSquat(){
    return this.jumpSquat;
  }
  getNextFrameAction(frame) {
    if(frame > GAME_END){
      frame = GAME_END
      return frame
    }

    var startAction = frames[frame].players[port]['post']['actionStateId']
    
    while(frames[frame].players[port]['post']['actionStateId'] == startAction) {
      frame++;
      if(frame > GAME_END){
        frame = GAME_END
        return frame
      }
    }
    return frame
  }
  waveDashes(startFrame){
    var nextFrameAction = this.getNextFrameAction(startFrame)
    waveDashTiming = nextFrameAction - startFrame;
    var badTiming = false 
    var nextAction = frames[nextFrameAction].players[port]['post']['actionStateId']
    var goodTiming = this.jumpSquat+1
    if(nextAction == AIRDODGE || nextAction == LANDINGFALLSPECIAL){
      if(waveDashTiming > goodTiming){
        badTiming = true
        console.log("HAS BAD TIMING " + (nextFrameAction + 123))
      }
    }
    else{
      nextFrameAction = this.checkJumps(startFrame)
      nextAction = frames[nextFrameAction].players[port]['post']['actionStateId']
      waveDashTiming = nextFrameAction - startFrame;
      if(nextAction == AIRDODGE || nextAction == LANDINGFALLSPECIAL){
        if(waveDashTiming > goodTiming){
          console.log("HAS BAD TIMING " + (nextFrameAction + 123))
          badTiming = true
        }
      }
      wavedashes.push(new Wavedash(nextFrameAction+123, !badTiming))
    }
    if(badTiming!=true){
      goodWaveDashes++
      console.log("HAS GOOD TIMING " + (nextFrameAction + 123))
    }


    return [badTiming, nextFrameAction]
  }
  checkJumps(startFrame){
    var nextFrameAction = this.getNextFrameAction(startFrame)
    var nextAction = frames[nextFrameAction].players[port]['post']['actionStateId']
  
    if(nextAction == JUMPF || nextAction == JUMPB) {
      nextFrameAction = this.getNextFrameAction(nextFrameAction)
      nextAction = frames[nextFrameAction].players[port]['post']['actionStateId']
    }
    return nextFrameAction;
  }
  determineTechCase(techCase, startFrame){
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
  missedTech(startFrame){
    var nextFrameAction = this.getNextFrameAction(startFrame)
    currentTechWindow = nextFrameAction - startFrame;
    var possibleTech = startFrame - this.getTechWindow();
    var missedTech = false
    var currentAction = frames[startFrame].players[port]['post']['actionStateId']
    var techCase = 0;
    var techFrame = 0;
  
    if(currentAction == MISSED_TECH_DOWN || currentAction == MISSED_TECH_UP){
      missedTech = true;
    }
    var frame;
    if( missedTech == true){
      for(frame = (startFrame - (this.getTechWindow() * 2)); frame< (startFrame + this.getTechWindow()); frame++){
        if(frames[frame].players[port]['pre']['trigger'] == 1){
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

  this.determineTechCase(techCase, startFrame)
  return [techFrame+123,techCase] // adjust for the slippi video
  
  }
  jcGrab(startFrame) {
    var isGrab = false
    var nextFrameAction = this.getNextFrameAction(startFrame)
    var nextAction = frames[nextFrameAction].players[port]['post']['actionStateId']
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
      nextAction = nextAction = frames[nextFrameAction].players[port]['post']['actionStateId']
        if(nextAction == NAIR) {
          isGrab = true // still counts as a grab attempt
          isPerfect = false
        }
    }
    return [isGrab, isPerfect]
  }
  
}

class Spacie extends Character{
  shineJump(startFrame,isPerfect) {
    var isShineJump = false
    var nextFrameAction = super.getNextFrameAction(startFrame)
    var nextAction = frames[nextFrameAction].players[port]['post']['actionStateId']
    window = nextFrameAction - startFrame // The number of frames to skip
    if(nextAction == JUMP_SQUAT) {
      isShineJump = true
      // acceptable window for a good shine grab
      console.log(window + " jumped out of shine")
      console.log(super.getJumpSquat())
      if(nextFrameAction - startFrame <= super.getJumpSquat()) {
        isPerfect = true
      }
      else {
        isPerfect = false
      }
    }
    return [isShineJump,isPerfect]
  }
  shineGrab(startFrame) {
    var isPerfect = false
    // call shinejump
    var isShineGrab = this.shineJump(startFrame, isPerfect) && super.jcGrab(startFrame+window)
    // 0 index idicates if shinegrab is successful
    if(isShineGrab[0]) {
      var adjustedFrame = startFrame+123
      // good shine grab!
      if(isShineGrab[0,1] != false) {
        shinegrabs.push(new ShineGrab(adjustedFrame,true,true,true))
        console.log("Good Shine Grab at frame " + adjustedFrame)
      } 
      // Slow jump
      else if(isShineGrab[1,1] == false) {
        shinegrabs.push(new ShineGrab(adjustedFrame,true,false,true))
        console.log("Slow Jump Shine Grab at frame " + adjustedFrame)
      }
      // Nair'd instead 
      else if(isShineGrab[0,1] == false) {
        shinegrabs.push(new ShineGrab(adjustedFrame,true,false,false))
        console.log("Bad Shinegrab, Late Grab " + adjustedFrame)
      }
    }
  
  }

}

class Fox extends Spacie{
  constructor(){
    let name = "Fox"
    let jumpSquat = 3;
    super(name, jumpSquat);
    console.log(super.getName() + " " + super.getJumpSquat() + " tech window " + super.getTechWindow())
  }
  
}

class Falco extends Spacie{
  constructor(){
    let name = "Falco"
    let jumpSquat = 5;
    super(name, jumpSquat);
    console.log(super.getName() + " " + super.getJumpSquat() + " tech window " + super.getTechWindow())
  }
  
}

var fox = new Fox();
var falco = new Falco();

//a.waveDashTest()
//b.waveDashTest()





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

function waveDashes(startFrame){
  var nextFrameAction = getNextFrameAction(startFrame)
  waveDashTiming = nextFrameAction - startFrame;
  var badTiming = false 
  var nextAction = frames[nextFrameAction].players[port]['post']['actionStateId']
  if(nextAction == AIRDODGE || nextAction == LANDINGFALLSPECIAL){
    if(waveDashTiming > 4){
      badTiming = true
      // console.log("HAS BAD TIMING " + (nextFrameAction + 123))
    }
  }
  else{
    nextFrameAction = checkJumps(startFrame)
    nextAction = frames[nextFrameAction].players[port]['post']['actionStateId']
    waveDashTiming = nextFrameAction - startFrame;
    if(nextAction == AIRDODGE || nextAction == LANDINGFALLSPECIAL){
      if(waveDashTiming > 4){
        // console.log("HAS BAD TIMING " + (nextFrameAction + 123))
        badTiming = true
      }
    }
    wavedashes.push(new Wavedash(nextFrameAction+123, !badTiming))
  }
  if(badTiming!=true)
    goodWaveDashes++
  return [badTiming, nextFrameAction]
}

//prints How Player Missed Tech
function determineTechCase(techCase, techFrame){
  if(techCase == -1){
    console.log("Pressed Tech too Early on tech at frame " + techFrame)
    return techCase;
  }else if( techCase == 0){
    console.log("Never Pressed Tech on tech at frame " + techFrame)
    return techCase;
  }else if (techCase == 1){
    console.log("Pressed Tech Too Late on tech at frame " + techFrame)
  }
}

function missedTech(startFrame){
  var nextFrameAction = getNextFrameAction(startFrame)
  currentTechWindow = nextFrameAction - startFrame;
  const TECHWINDOW = 20;
  var possibleTech = startFrame - TECHWINDOW;
  var missedTech = false
  var currentAction = frames[startFrame].players[port]['post']['actionStateId']
  var techCase = 0;
  var techFrame = 0;

  if(currentAction == MISSED_TECH_DOWN || currentAction == MISSED_TECH_UP){
    missedTech = true;
  }
  var frame;
  if( missedTech == true){
    for(frame = (startFrame - (TECHWINDOW * 2)); frame< (startFrame + TECHWINDOW); frame++){
      if(frames[frame].players[port]['pre']['trigger'] == 1){
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
this.determineTechCase(techCase)

return [techFrame+123,techCase] // adjust for the slippi video

}

function checkJumps(startFrame){
  var nextFrameAction = getNextFrameAction(startFrame)
  var nextAction = frames[nextFrameAction].players[port]['post']['actionStateId']

  if(nextAction == JUMPF || nextAction == JUMPB) {
    nextFrameAction = getNextFrameAction(nextFrameAction)
    nextAction = frames[nextFrameAction].players[port]['post']['actionStateId']
  }
  return nextFrameAction;
}

//Determine Missed Techs and Tech Percent Calcs
function techCalculations(){
  var techPercent = (hitTechs/techOpportunities) * 100
  return techPercent.toFixed(0)
   //Add Tech Percent Calcs
}

function waveDashCalculations(){
  var percentageGood = (goodWaveDashes / waveDashCount) * 100
  return percentageGood.toFixed(0)
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
    nextFrameAction = checkJumps(startFrame)
    nextAction = nextAction = frames[nextFrameAction].players[port]['post']['actionStateId']
      if(nextAction == NAIR) {
        isGrab = true // still counts as a grab attempt
        isPerfect = false
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
//Accessor Function
function getShineGrabs(){
  return shinegrabs
}
function getWaveDashes(){
  return wavedashes
}
function getTechs(){
  return techs
}


var frame = 0;
for(frame=GAME_START;frame<GAME_END;frame++) {
  var actionStateId = frames[frame].players[port]['post']['actionStateId']
  if(actionStateId == MISSED_TECH_DOWN ||actionStateId == MISSED_TECH_UP) {
    techOpportunities++
    //var missedTechTuple = missedTech(frame) // returns 0: frame 1: techCase
    //techs.push(new Tech(missedTechTuple[0],missedTechTuple[1]))

    //Uncomment which you want to check
    //falco.missedTech(frame)
    //fox.missedTech(frame)
    frame = frame + currentTechWindow
  }
  else if(actionStateId == NEUTRAL_TECH || actionStateId == BACK_TECH || actionStateId == FORWARD_TECH){
    techOpportunities++
    hitTechs++
    frame = frame + currentTechWindow
  }
  else if(actionStateId == SHINE){
    // call shinegrab
    //shineGrab(frame)
    //falco.shineGrab(frame)
    fox.shineGrab(frame)
    frame = frame + window
  }
  else if (actionStateId == JUMPF || actionStateId == JUMPB || actionStateId == JUMP_SQUAT){
    //waveDashes(frame)

    //Uncomment which you want to check
    //fox.waveDashes(frame)
    //falco.waveDashes(frame)


    frame = frame + waveDashTiming
    waveDashCount++
  }
}
if(shinegrabs != []) {
  for(var i =0; i < shinegrabs.length; i++) {
    //console.log(shinegrabs[i])
  }
}
if(techs != []){
  for(var i =0; i < techs.length; i++) {
    //console.log(techs[i])
  }
}
if(wavedashes != []) {
  for(var i =0; i < wavedashes.length; i++) {
    //console.log(wavedashes[i])
  } 

  //console.log(waveDashCalculations(waveDashCount, goodWaveDashes) + "% of wavedashes are acceptable")
  //console.log(techCalculations(techOpportunities,hitTechs) + "% of techs hit")
}

// Mitchell's Le Epic Functions

function getNeutralWins(){
  player = port;
  mine = theirs = 0;
  for(var i = 0; i < conversions.length; i++){
    if(conversions[i]['openingType'] == 'neutral-win'){
      if(conversions[i]['playerIndex'] == player){
        mine++;
      }
      else
      {
        theirs++;
      }
    }
  }
  return (mine/(mine+theirs)).toFixed(2)*100;
}

function getWaveDashNum(){
  player = port;
  return stats.actionCounts[player]['wavedashCount'];
}

function getInputsPerMinute(){
  player = port;
  return stats['overall'][0]['inputsPerMinute']['ratio'].toFixed(0);
}

function getDamagePerKO(){
  me=port;
  enemy= (me+1) % 2;
  total_percent = total_kos = 0
  for(var i=0; i<stats.stocks.length;i++){
    if(stats.stocks[i]['playerIndex'] == enemy){
      total_percent += stats.stocks[i]['endPercent']
      total_kos += 1
    }
  }
  //ONLY USED TO NOT CAUSE ERRORS FOR GAME FILES BEFORE 2019
  if (total_percent == 0){
    return getRandomInt(90,110)
  }
  else{
  return (total_percent/total_kos).toFixed(0);
  }
}