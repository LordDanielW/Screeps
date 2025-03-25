const CycleManager = require("cycleMan");
const StatsManager = require("statsMan");
const SpawnManager = require("spawnMan");
const BuildManager = require("buildMan");
const Visualizer = require("visualizer");
const RoleRunner = require("runner");
const MemoryMain = require("memory");

const ConsoleCommands = require("consoleCommands");
ConsoleCommands.registerGlobals();

// Initialize memory structure
MemoryMain.initialize();

// Simple main module that spawns miners
module.exports.loop = function () {
  // Clean memory of dead creeps
  MemoryMain.cleanup();

  // Initialize cycle manager if needed
  if (!Memory.cycle) {
    CycleManager.initialize();
  }

  // Update the cycle manager
  CycleManager.update();

  // Run the spawn manager
  SpawnManager.run();

  // Run creep logic
  for (const name in Game.creeps) {
    RoleRunner.run(Game.creeps[name]);
  }

  // Render visualizations
  Visualizer.render();
};
