const { default: SlippiGame } = require('@slippi/slippi-js');
const game = new SlippiGame("test_game.slp");

const frames = game.getFrames()
console.log(frames[0].players)