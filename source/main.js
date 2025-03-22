//  Import Modules
//
var Roles = require("roles.all");
var manage = require("manage.all");
var myMemory = require("memory.all");
var utils = require("utils.all");
var memInit = require("memory.init");

//  Variables
// var myRoomOne = Game.rooms.E9N52;
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

  // Initialize memory to ensure TaskMan is properly populated
  memInit.initMemory();

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

  //  Rooms
  //
  //
  for (let roomName in Game.rooms) {
    runRooms(Game.rooms[roomName]);
  }

  //  Screep Run Loop
  //
  if (Memory.creepMove && Memory.creepMove.length > 0) {
    runMoveScreeps();
  } else {
    runScreeps();
  }

  //  run Linker Transfer
  //
  // manage.runLinkerTransfer(myRoomOne);

  // run Factory
  //
  // manage.runFatcory(myRoomOne);

  // Check for emergency spawn situations
  memInit.generateEmergencySpawnQueue();

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

  //  Rooms
  try {
    for (let roomName in Game.rooms) {
      runRooms(Game.rooms[roomName]);
    }
  } catch (e) {
    console.log("Room Processing Fail");
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
  //   manage.runLinkerTransfer();
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

  // Memory initialization in slow loop too
  try {
    memInit.initMemory();
  } catch (e) {
    console.log("Memory Init Fail");
    console.log(e);
    stillFailing = true;
  }

  // Generate emergency spawn queue if needed
  try {
    memInit.generateEmergencySpawnQueue();
  } catch (e) {
    console.log("Emergency Spawn Queue Fail");
    console.log(e);
    stillFailing = true;
  }

  // run Spawn
  try {
    for (const spawnName in Game.spawns) {
      manage.spawnCreeps(spawnName);
    }
  } catch (e) {
    console.log("Spawn Fail");
    console.log(e);

    // Reset spawn queues to prevent getting stuck
    for (const spawnName in Game.spawns) {
      if (!Memory.TaskMan[spawnName]) {
        Memory.TaskMan[spawnName] = {};
      }

      Memory.TaskMan[spawnName].spawn = [];
      Memory.TaskMan[spawnName].spawnListNumber = -1;
      Memory.TaskMan[spawnName].spawnExtrasNumber = -1;
    }
    stillFailing = true;
  }

  Memory.lastLoopFailed = stillFailing;
};
// End Slow Loop

// run Rooms
//
function runRooms(room) {
  manage.runRoom(room.name);

  //  Run Towers
  //  check repair, heal, and attack
  //  show attack rings
  var towers = room.find(FIND_STRUCTURES, {
    filter: (structure) => {
      return structure.structureType == STRUCTURE_TOWER;
    },
  });
  for (var i = 0; i < towers.length; i++) {
    manage.Tower.run(towers[i]);
    if (showGraphics) {
      utils.displayAttackRings(room.name, towers[i]);
    }
  }
}
// End Rooms

// Run Screeps
//
function runScreeps() {
  for (var name in Game.creeps) {
    var creep = Game.creeps[name];
    if (!creep.spawning) {
      Roles[creep.memory.role].run(creep);
    }
  }
}
// End Run Screeps

// run try Screeps
//
function runTryScreeps() {
  for (var name in Game.creeps) {
    var creep = Game.creeps[name];
    try {
      Roles[creep.memory.role].run(creep);
    } catch (e) {
      console.log("Creep Fail");
      console.log(creep.name);
      console.log(e);
    }
  }
}

// Run move Screeps
//
function runMoveScreeps() {
  for (var name in Game.creeps) {
    var creep = Game.creeps[name];
    if (name != Memory.selectCreep) {
      Roles[creep.memory.role].run(creep);
    } else {
      manage.moveCreep(creep);
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

  // Clean up invalid memory entries in TaskMan
  for (let roomName in Memory.TaskMan) {
    // Skip if it's a spawn name
    if (Game.spawns[roomName]) continue;

    // Skip if it's a valid room we have visibility in
    if (Game.rooms[roomName]) continue;

    // Keep some required global properties
    if (["Tick", "NameNum", "breakList"].includes(roomName)) continue;

    // Otherwise, check if it's a stale reference
    if (Memory.TaskMan[roomName].sourceContainers) {
      // Verify container existence
      let validContainers = [];
      for (let id of Memory.TaskMan[roomName].sourceContainers) {
        if (Game.getObjectById(id)) {
          validContainers.push(id);
        }
      }
      Memory.TaskMan[roomName].sourceContainers = validContainers;
    }

    // Verify upgrade container existence
    if (Memory.TaskMan[roomName].upgradeContainer) {
      if (!Game.getObjectById(Memory.TaskMan[roomName].upgradeContainer)) {
        Memory.TaskMan[roomName].upgradeContainer = null;
      }
    }
  }
}
