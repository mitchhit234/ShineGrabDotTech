var fs = require('fs');
// console.log("Enter header.js")

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
if(ret === undefined){
  console.log("undefined header")
}

//const game = new SlippiGame("views/uploads/temp.slp");
const game  = new SlippiGame("views/uploads/temp.slp")

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

const gameSettings = game.getSettings();

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

eval(fs.readFileSync('characterClass.js')+'');