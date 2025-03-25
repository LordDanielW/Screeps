const CycleManager = require("cycleMan");
const StatsManager = require("statsMan");
const SpawnManager = require("spawnMan");
const BuildManager = require("buildMan");
const Visualizer = require("visualizer");
const CreepFactory = require("factory");
const roleRunner = require("runner");
const consoleCommands = require("consoleCommands");
const Memory = require("memory");
consoleCommands.registerGlobals();

// Initialize memory structure
Memory.initialize();

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

// Simple main module that spawns miners
module.exports.loop = function () {
  // Clean memory of dead creeps
  Memory.cleanup();

  // Handle spawn logic for all spawns
  SpawnManager.run();

  // Run creep logic
  for (const name in Game.creeps) {
    roleRunner.run(Game.creeps[name]);
  }

  // Render visualizations
  Visualizer.render();
};
