// getSettings(): GameStartType;
// getLatestFrame(): FrameEntryType | null;
// getGameEnd(): GameEndType | null;
// getFrames(): FramesType;
// getStats(): StatsType;
// getMetadata(): MetadataType;
// getFilePath(): string | null;

const { default: SlippiGame } = require('@slippi/slippi-js');
const game = new SlippiGame("test_game.slp");


const frames = game.getFrames()

// *lastFrame* gives the total number of frames in the
// game (not including -123 to 0 before players can act)
const meta_data = game.getMetadata();

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


console.log(frames[836].players[1]['post']['actionStateId'])



for(i=0; i < meta_data.length; i++) {
  //console.log(frames[0].players[1]['post'])
  if(frames[i].players[1]['post']['actionStateId'] == 361){
    //console.log(frames[836].players[1]['post']['actionStateId'])
    //console.log(i + " : frame")
    console.log(i +", " + frames[i].players[1]['post']['actionStateId'])
  }
  //console.log(frames[i].players[1]['post']['lastAttackLanded'])
}