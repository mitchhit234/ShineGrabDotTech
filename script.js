// getSettings(): GameStartType;
// getLatestFrame(): FrameEntryType | null;
// getGameEnd(): GameEndType | null;
// getFrames(): FramesType;
// getStats(): StatsType;
// getMetadata(): MetadataType;
// getFilePath(): string | null;

const SHINE = 361;
const PRECUM = 24; // prejump ;)
const GRAB = 212;

const { default: SlippiGame } = require('@slippi/slippi-js');
const game = new SlippiGame("shinegrab.slp");


const frames = game.getFrames()

// *lastFrame* gives the total number of frames in the
// game (not including -123 to 0 before players can act)
const meta_data = game.getMetadata();

var i;
var j;
var k;


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

for(i=-123; i < meta_data['lastFrame']; i++) {
  var is_shinegrab = false
  if(frames[i].players[0]['post']['actionStateId'] == SHINE){
    // console.log(i +", " + frames[i].players[0]['post']['actionStateId'])
    // 21 frames after i is acceptable for a shine grab
    for(j = i; j < i+21; j++) {
      // check if action state is not shine
      if(frames[j].players[0]['post']['actionStateId'] != SHINE){
        var new_action = frames[j].players[0]['post']['actionStateId']
        if(new_action == PRECUM) {
          // check next three frames for grab
          for(k = j+1; k <= j+3; k++) {
            if(frames[k].players[0]['post']['actionStateId'] == GRAB) {
              is_shinegrab = true
              i = i+4
            }
          }
        }
      }
    }
    if(is_shinegrab) {
      console.log("Shine grab")
    }
  }
}