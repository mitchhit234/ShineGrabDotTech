var fs = require('fs');

// Divides our text files into arrays
// Indexes seperated by newline
function splitLines(t){
  return t.split(/\r\n|\r|\n/);
}

// Input string of character name
// Output array of state name to stateID array
function readCharacterActionState(character_name){
  try {
    var fileName = 'assets/' + character_name + '.txt';
    var data = fs.readFileSync(fileName, 'utf8');
    var stateIDs = splitLines(data); 
    return stateIDs;   
  } catch(e) {
    console.log('Error:', e.stack);
  }
}

// Input a stateID array and action name
// Returns the corresponding index that will be
// what we see in the slippi data frame object
// under 'actionStateID'
function getActionStateID(stateIDs, action_name){
  const find = (element) => element == action_name; 
  return stateIDs.findIndex(find);
}

// Given a stageID from game settings.stageID, 
// Return the name of the stage 
function getStageName(stageID){
  stageDict = readCharacterActionState('stages')
  return stageDict[stageID];
}