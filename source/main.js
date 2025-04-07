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
  runTicks();

  //  Garbage Collect
  //
  garbageCollect();

  //  Rooms
  //
  for (let roomName in Game.rooms) {
    manage.runRoom(roomName);
  }

  //  Screep Run Loop
  //
  // Run creep logic
  for (const name in Game.creeps) {
    runScreep(Game.creeps[name]);
  }
};
// End Loop

// Run Screeps
//
function runScreep(creep) {
  // If the creep is still spawning, ignore it
  if (creep.spawning) return;

  // Get the creep's role
  const role = creep.memory.role;

  if (
    creep.name == Memory.selectCreep &&
    Memory.creepMove &&
    Memory.creepMove.length > 0
  ) {
    utils.moveCreep(creep);
  } else if (Roles[role]) {
    Roles[role].run(creep);
  } else if (!fixCreep(creep)) {
    console.log(`Unknown role: ${role} for creep: ${creep.name}`);

    console.log("Available roles:", Object.keys(Roles));
  }
}
// End Run Screeps

// Fix Creep
//
function fixCreep(creep) {
  // Check if the creep's role is undefined or not set
  if (!creep.memory.role) {
    // Check if the creep's name contains a role and assign it
    for (const role in Roles) {
      if (creep.name.toLowerCase().includes(role.toLowerCase())) {
        creep.memory.role = role;
        return true;
      }
    }

    // If no role is found in the name, assign based on body type
    const bodyParts = _.countBy(creep.body, (part) => part.type);
    if (bodyParts[WORK] && bodyParts[CARRY] && bodyParts[MOVE]) {
      creep.memory.role = "Builder";
    } else if (bodyParts[WORK] && bodyParts[MOVE]) {
      creep.memory.role = "Miner";
    } else if (bodyParts[CARRY] && bodyParts[MOVE]) {
      creep.memory.role = "Carrier";
    } else {
      return false; // No valid role found
    }
    return true; // Indicate that the creep was fixed
  } else {
    switch (creep.memory.role) {
      case "Repairer":
        creep.memory.role = "Repair";
        break;
      case "miner":
        creep.memory.role = "Miner";
        break;
      case "upgrader":
        creep.memory.role = "Upgrader";
        break;
      case "builder":
        creep.memory.role = "Builder";
        break;
      default:
        return false;
    }
  }
  return true; // Catches all switch cases
}
// End Fix Creep

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
} // End Garbage Collect

//  Run Ticks
//
var runTicks = function () {
  Memory.Tick++;

  if (Memory.Tick >= 1460) {
    Memory.Tick = 0;

    // Process each spawn in the game
    for (const spawnName in Game.spawns) {
      const spawn = Game.spawns[spawnName];
      if (!Memory.TaskMan[spawnName]) {
        Memory.TaskMan[spawnName] = {};
      }

      Memory.TaskMan[spawnName].spawn = [];
      // Memory.TaskMan[spawnName].spawnListNumber = 0;
    }
  }
};
