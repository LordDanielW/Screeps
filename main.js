//  Import Modules
//
var roles = require("roles.all");
var manage = require("manage.all");
var myMemory = require("memory.all");
var utilities = require("utilities.all");

//  Variables
var myRoomOne = Game.rooms.E9N52;
//var myRoomTwo = Game.rooms.W16N39;

global.showGraphics = false;

// This is a function accessible to all modules and the console
global.helloWorld = () => {
  console.log("Hello Console.");
  return true;
};

//  Main Loop
//
module.exports.loop = function () {
  // Last Loop Failed
  //  if the last loop failed, try catch everything
  let lastLoopFailed = Memory.lastLoopFailed;
  Memory.lastLoopFailed = true;

  if (lastLoopFailed) {
    //  Slow Loop
    module.exports.slowLoop();
  } else {
    // Fast Loop
    module.exports.fastLoop();
    Memory.lastLoopFailed = false;
  }
};

//  Fast loop
//
module.exports.fastLoop = function () {
  // try {
  //   console.log(myMemory.spawnList[0].role);
  // } catch (e) {
  //   console.log(e);
  // }
  //  Ticks
  //  basis for actions on a creeps 1500 tick life.
  manage.doTicks();

  //  Garbage Collect
  //  remove dead creeps from memory
  garbageCollect();

  //  Towers
  //  check repair, heal, and attack
  //  show attack rings
  runTowers(myRoomOne);

  //  Screep Run Loop
  //
  runScreeps();

  //  run Linker Transfer
  //
  // manage.runLinkerTransfer(myRoomOne);

  // run Factory
  //
  // manage.runFatcory(myRoomOne);

  // run Spawn
  //
  for (const spawnName in Game.spawns) {
    manage.spawnCreeps(spawnName);
  }
};
// End Fast Loop

//  Slow Loop
//
module.exports.slowLoop = function () {
  let stillFailing = false;

  //  Ticks
  try {
    manage.doTicks();
  } catch (e) {
    console.log("Ticks Fail");
    console.log(e);
    stillFailing = true;
  }

  //  Garbage Collect
  try {
    garbageCollect();
  } catch (e) {
    console.log("Garbage Collect Fail");
    console.log(e);
    stillFailing = true;
  }

  //  Towers
  try {
    runTowers(myRoomOne);
  } catch (e) {
    console.log("Tower Fail");
    console.log(e);
    stillFailing = true;
  }

  //  Try Screep Run Loop
  try {
    runTryScreeps();
  } catch (e) {
    console.log("Screep Run Loop Fail");
    console.log(e);
    stillFailing = true;
  }

  //  run Linker Transfer
  // try {
  //   manage.runLinkerTransfer(myRoomOne);
  // } catch (e) {
  //   console.log("Linker Transfer Fail");
  //   console.log(e);
  //   stillFailing = true;
  // }

  // run Factory
  // try {
  //   manage.runFatcory(myRoomOne);
  // } catch (e) {
  //   console.log("Factory Fail");
  //   console.log(e);
  //   stillFailing = true;
  // }

  // run Spawn
  try {
    for (const spawnName in Game.spawns) {
      manage.spawnCreeps(spawnName);
    }
  } catch (e) {
    console.log("Spawn Fail");
    console.log(e);

    Memory.TaskMan.Spawn1.spawn = [];
    Memory.TaskMan.Spawn1.spawnListNumber = -1;
    Memory.TaskMan.Spawn1.spawnExtrasNumber = -1;

    // Memory.TaskMan.Vat2 = {};
    Memory.TaskMan.Vat2.spawn = [];
    Memory.TaskMan.Vat2.spawnListNumber = -1;
    Memory.TaskMan.Vat2.spawnExtrasNumber = -1;
    stillFailing = true;
  }

  Memory.lastLoopFailed = stillFailing;
};
// End Slow Loop

// run Towers
//
function runTowers(theRoom) {
  var towers = theRoom.find(FIND_STRUCTURES, {
    filter: (structure) => {
      return structure.structureType == STRUCTURE_TOWER;
    },
  });
  for (var i = 0; i < towers.length; i++) {
    manage.Tower.run(towers[i]);
    if (showGraphics) {
      utilities.displayAttackRings(theRoom, towers[i]);
    }
  }
}
// End Towers

// Run Screeps
//
function runScreeps() {
  for (var name in Game.creeps) {
    var creep = Game.creeps[name];
    roles[creep.memory.role].run(creep);
  }
}
// End Run Screeps

// run try Screeps
//
function runTryScreeps() {
  for (var name in Game.creeps) {
    var creep = Game.creeps[name];
    try {
      roles[creep.memory.role].run(creep);
    } catch (e) {
      console.log("Creep Fail");
      console.log(e);
    }
  }
}

//  Garbage Collect
//
//
function garbageCollect() {
  for (var name in Memory.creeps) {
    if (!Game.creeps[name]) {
      delete Memory.creeps[name];
    }
  }
}
