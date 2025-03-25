const CycleManager = require("cycle");
const StatsManager = require("stats");
const Visualizer = require("visualizer");
const Construction = require("construction");
const CreepFactory = require("factory");
const roleRunner = require("runner");
const consoleCommands = require("consoleCommands");
consoleCommands.registerGlobals();

// // Initialize memory structure on first run
// if (!Memory.speedRun) {
//   Memory.speedRun = {
//     startTick: Game.time,
//     cyclePhase: 0,
//     lastPhaseChange: Game.time,
//     stats: {
//       energyMined: 0,
//       energyUsed: 0,
//       idleTicks: {
//         byCreep: {},
//         spawn: 0,
//       },
//     },
//     construction: {
//       completed: {},
//     },
//   };

//   // Register any custom variants here
//   CreepFactory.registerCustomVariant(
//     "minerSpecial", // variant name
//     "miner", // role
//     { work: 8, carry: 2, move: 0 }, // body
//     { special: true }, // additional memory
//     900, // minimum energy
//     5 // maximum RCL
//   );

//   CreepFactory.registerCustomVariant(
//     "upgradeSpecial", // variant name
//     "upgrade", // role
//     { work: 10, carry: 4, move: 0 }, // body
//     { special: true }, // additional memory
//     1200, // minimum energy
//     5 // maximum RCL
//   );
// }

// Simple main module that spawns miners
module.exports.loop = function () {
  // Clean memory of dead creeps
  for (const name in Memory.creeps) {
    if (!Game.creeps[name]) {
      delete Memory.creeps[name];
    }
  }

  // Update cycle phase
  // CycleManager.update();

  // Find my spawners
  const spawner = Game.spawns["Vat1"];

  // Define the creep bodies
  const minerStartBody = [WORK, WORK, CARRY]; // minerStart body
  const minerTinyBody = [WORK, WORK, WORK]; // minerTiny with 3 WORK parts

  // Count our creeps by role
  const minerStarts = _.filter(
    Game.creeps,
    (creep) => creep.memory.role === "minerStart"
  );

  const heavyMiners = _.filter(
    Game.creeps,
    (creep) => creep.memory.role === "miner"
  );

  // Spawn logic - prioritize minerStart if we don't have one
  if (minerStarts.length < 1) {
    // Generate a unique name for the miner
    const newName = "MinerStart" + Game.time;

    const sources = spawner.room.find(FIND_SOURCES);
    // Find the closest source to the spawner (prefer north if possible)
    let closestSource = null;
    if (sources.length > 0) {
      // First try to find a source north of the spawner
      const northSources = sources.filter(
        (source) => source.pos.y < spawner.pos.y
      );

      if (northSources.length > 0) {
        // Get the closest northern source
        closestSource = spawner.pos.findClosestByPath(northSources);
      } else {
        // If no northern sources, get any closest source
        closestSource = spawner.pos.findClosestByPath(sources);
      }
    }

    // Spawn the starter miner
    spawner.spawnCreep(minerStartBody, newName, {
      memory: {
        role: "minerStart",
        working: false,
        sourceId: closestSource ? closestSource.id : null,
      },
      directions: [TOP], // North direction
    });
  }
  // If we have a minerStart but no heavy miners, spawn one
  else if (heavyMiners.length < 1) {
    // Generate a unique name for the heavy miner
    const newName = "minerTiny" + Game.time;

    const sources = spawner.room.find(FIND_SOURCES);
    // Find a source to the northwest of spawner if possible
    let northwestSource = null;
    if (sources.length > 0) {
      // Try to find a source northwest of the spawner
      // (both y and x coordinates are less than spawner's)
      const northwestSources = sources.filter(
        (source) => source.pos.y < spawner.pos.y && source.pos.x < spawner.pos.x
      );

      if (northwestSources.length > 0) {
        // Get the closest northwestern source
        northwestSource = spawner.pos.findClosestByPath(northwestSources);
      } else {
        // If no northwestern sources, try just north sources first, then any source
        const northSources = sources.filter(
          (source) => source.pos.y < spawner.pos.y
        );

        if (northSources.length > 0) {
          northwestSource = spawner.pos.findClosestByPath(northSources);
        } else {
          // If still no suitable source, pick the closest one that's not already taken
          const availableSources = sources.filter(
            (source) =>
              !_.some(
                Game.creeps,
                (c) =>
                  c.memory.sourceId === source.id &&
                  c.memory.role === "minerStart"
              )
          );

          if (availableSources.length > 0) {
            northwestSource = spawner.pos.findClosestByPath(availableSources);
          } else {
            // If all sources are taken, just pick any source
            northwestSource = sources[0];
          }
        }
      }
    }

    // Spawn the heavy miner
    spawner.spawnCreep(minerTinyBody, newName, {
      memory: {
        role: "miner",
        working: false,
        sourceId: northwestSource ? northwestSource.id : null,
      },
      directions: [TOP_LEFT], // Northwest direction
    });
  }

  // // Run room-specific logic
  // for (const roomName in Game.rooms) {
  //   const room = Game.rooms[roomName];
  //   if (room.controller && room.controller.my) {
  //     // Update stats
  //     StatsManager.collect(room);

  //     // Check construction timeline
  //     Construction.check(room);

  //     // Handle creep spawning
  //     CreepFactory.run(room);
  //   }
  // }

  // Run creep logic
  for (const name in Game.creeps) {
    roleRunner.run(Game.creeps[name]);
  }

  // Render visualizations
  Visualizer.render();
};
