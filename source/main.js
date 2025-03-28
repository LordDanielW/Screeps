//  Import Modules
//
var Roles = require("roles.all");
var manage = require("manage.all");
var myMemory = require("memory.all");
var utils = require("utils.all");

//  Globals
global.showGraphics = false;

// This is a function accessible to all modules and the console
global.helloWorld = () => {
  console.log("Hello Console.");
  return true;
};

// Initialize Memory
//
myMemory.initMemory();

// ******************************************************************
//  Main Loop
//
// ******************************************************************
module.exports.loop = function () {
  //  Manage Ticks
  //
  manage.doTicks();

  //  Garbage Collect
  //
  // garbageCollect();

  //  Rooms
  //
  // for (let roomName in Game.rooms) {
  //   runRooms(Game.rooms[roomName]);
  // }

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
  // memInit.generateEmergencySpawnQueue();

  // run Spawn
  //
  // for (const spawnName in Game.spawns) {
  //   manage.spawnCreeps(spawnName);
  // }
};
// End Loop

// Run Rooms
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
