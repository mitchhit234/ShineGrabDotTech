// YO: SLIPPI REPLAY PARSER INDEXES AT 0 BUT SLIPPI.JS INDEXES AT -123
//Read in Charatcer Tips

if(ret === undefined){
  console.log("undefined main")
}

console.log("Enter Main")
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




//Classes

//Make sure if you're testing the different characters and classes, you go down to the driver function (the loop at the bottom), and uncomment out
//which character you want to test at what time.
//So if you want to test falco WD output, go down to the bottom and uncomment out falco.waveDashes(frame)

//Class Character is the base class that all individual characters will inherit. (characterClass.js)
  //Character has access to any and every method and variable that all different melee characters have. (characterMethods.js)
  //These are things like jumpsquat, name, tech window, jump cancel grab. These are all things that every melee character has access to.

//Class Spacie inherits Character class, and Fox and Falco will inherit Spacie. (spacieClass.js)
  //Spacie has access to every method that both Fox and Falco have access to and no one else. Things like Shinegrab, Waveshine, Jump out of Shine. (spacieMethods.js)
  //Pretty much anything to do with shine will end up going into the Spacie class.

//Classes Fox and Class Falco will inherit the Spacie class (namedCharacterClasses.js)
  //Class Fox and Class Falco will contain things that only that particular space animal have access to that the other doesn't. (namedCharacterMethods.js)
  //Think standing double laser with fox, or Waveshine Upsmash (falco has this but it's like never used, not worth tracking), or double laser from ledge. 

//Class {Character} will inherit the Character class. (namedCharacterClasses.js)
  //For all other characters that aren't Fox or Falco, they will just inherit the Character class straight up.
  //Within each individual {Character}'s class, will contain things that only that character can do. (namedCharacterMethods.js)
  //Think Falcon gentleman, marth chaingrab on fox, whatever we want.



function setPort(portNum){
  port = portNum;
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


const currentGame = new SlippiGame("views/uploads/temp.slp");
const currentSettings = currentGame.getSettings();
playerCharacterId = currentSettings.players[ret]['characterId']
playerCharacterName = getCharacterNames(playerCharacterId)
var playerIndex = (currentSettings.players[ret]['port'] - 1)
//console.log(stats)

//Create character object
if(playerCharacterName == "Fox"){
  console.log("new Fox created")
  var character = new Fox();
}
else if(playerCharacterName == "Falco"){
  console.log("new Falco created")
  var character = new Falco();
}
else if(playerCharacterName == "Marth"){
  console.log("new Marth created")
  var character = new Marth();
}
else if(playerCharacterName == "Sheik"){
  console.log("new Sheik created")
  var character = new Sheik();
}
else if (playerCharacterName == "Captain Falcon"){
  console.log("new Falcon created")
  var character = new Falcon();
}
else{
  console.log("That character hasn't been implemented yet")
  return
}



var frame = 0;
for(frame=GAME_START;frame<GAME_END;frame++) {
  var actionStateId = frames[frame].players[playerIndex]['post']['actionStateId']
  if(actionStateId == MISSED_TECH_DOWN ||actionStateId == MISSED_TECH_UP) {
    techOpportunities++
     // returns 0: frame 1: techCase

    //Uncomment which you want to check
    var missedTechTuple = character.missedTech(frame)
    techs.push(new Tech(missedTechTuple[0],missedTechTuple[1]))
    frame = frame + currentTechWindow
  }
  else if(actionStateId == NEUTRAL_TECH || actionStateId == BACK_TECH || actionStateId == FORWARD_TECH){
    techOpportunities++
    hitTechs++
    frame = frame + currentTechWindow
  }
  else if(actionStateId == SHINE){
    // call shinegrab
    if(character.getSpacie() == true){
      character.shineGrab(frame)
    }
    frame = frame + window
  }
  else if (actionStateId == JUMPF || actionStateId == JUMPB || actionStateId == JUMP_SQUAT){
    //waveDashes(frame)

    //Uncomment which you want to check
    character.waveDashes(frame)

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


}

// Mitchell's Le Epic Functions

function getNeutralWins(){
  player = playerIndex;
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
  player = playerIndex;
  return stats['overall'][0]['inputsPerMinute']['ratio'].toFixed(0);
}

function getDamagePerKO(){
  me=playerIndex;
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

console.log("Exit Main")