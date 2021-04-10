const { default: SlippiGame } = require('@slippi/slippi-js');
const game = new SlippiGame("test_game.slp");

const frames = game.getFrames()
var i;
for(i=0; i < 1000; i++) {
  console.log(frames[i].players[0]['post'])
}