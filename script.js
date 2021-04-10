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
const meta_data = game.getMetadata();
var i;

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