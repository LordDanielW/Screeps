const CycleManager = require("manager.cycle");
const StatsManager = require("manager.stats");
const Visualizer = require("manager.visualizer");
const Construction = require("manager.construction");
const CreepFactory = require("creeps.factory");
const roleRunner = require("creeps.runner");

// Initialize memory structure on first run
if (!Memory.speedRun) {
  Memory.speedRun = {
    startTick: Game.time,
    cyclePhase: 0,
    lastPhaseChange: Game.time,
    stats: {
      energyMined: 0,
      energyUsed: 0,
      idleTicks: {
        byCreep: {},
        spawn: 0,
      },
    },
    construction: {
      completed: {},
    },
  };

  // Register any custom variants here
  CreepFactory.registerCustomVariant(
    "minerSpecial", // variant name
    "miner", // role
    { work: 8, carry: 2, move: 0 }, // body
    { special: true }, // additional memory
    900, // minimum energy
    5 // maximum RCL
  );

  CreepFactory.registerCustomVariant(
    "upgradeSpecial", // variant name
    "upgrade", // role
    { work: 10, carry: 4, move: 0 }, // body
    { special: true }, // additional memory
    1200, // minimum energy
    5 // maximum RCL
  );
}

module.exports.loop = function () {
  // Clean memory of dead creeps
  for (const name in Memory.creeps) {
    if (!Game.creeps[name]) {
      delete Memory.creeps[name];
    }
  }

  // Update cycle phase
  CycleManager.update();

  // Run room-specific logic
  for (const roomName in Game.rooms) {
    const room = Game.rooms[roomName];
    if (room.controller && room.controller.my) {
      // Update stats
      StatsManager.collect(room);

      // Check construction timeline
      Construction.check(room);

      // Handle creep spawning
      CreepFactory.run(room);
    }
  }

  // Run creep logic
  for (const name in Game.creeps) {
    roleRunner.run(Game.creeps[name]);
  }

  // Render visualizations
  Visualizer.render();
};
