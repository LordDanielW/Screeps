// utils/consoleCommands.js
const MemoryMain = require("memory");

const consoleCommands = {
  /**
   * Restart the game by killing all creeps and resetting stats and cycle progress
   */
  reset: function () {
    console.log("Executing complete restart command...");

    // Kill all creeps
    for (const name in Game.creeps) {
      console.log(`Killing creep: ${name}`);
      Game.creeps[name].suicide();
    }

    MemoryMain.initialize(true);
    // Reset stats
    // Memory.stats = {};

    // Clear creep memory to avoid memory leaks
    for (const name in Memory.creeps) {
      if (!Game.creeps[name]) {
        console.log(`Clearing memory for creep: ${name}`);
        delete Memory.creeps[name];
      }
    }

    // // Reset cycle and phase progress
    // if (Memory.cycle) {
    //   console.log("Resetting cycle progress and tick counter");
    //   Memory.cycle = {
    //     startTick: Game.time, // Reset start tick to now
    //     currentPhase: 1, // Reset to phase 1
    //     elapsedTicks: 0, // Reset elapsed ticks
    //     lastSpawnTick: 0, // Reset spawn tracking
    //     scheduledSpawns: {}, // Clear scheduled spawns
    //   };
    // }

    // Reset spawn queues if they exist
    if (Memory.spawn) {
      console.log("Clearing spawn queues");
      Memory.spawn.queue = [];
      Memory.spawn.stats = {
        totalSpawned: 0,
        spawnsByVariant: {},
        idleTicks: 0,
      };
    }

    console.log(
      "Full restart completed. All creeps terminated, stats reset, and cycle progress reset."
    );
    return "OK";
  },

  /**
   * Print out Memory as JSON, and all creeps memory
   */
  printMem: function () {
    console.log("===== MEMORY DUMP =====");

    // Print global Memory object
    console.log("Global Memory:");
    console.log(JSON.stringify(Memory, null, 2));

    // Print specific creep memory
    console.log("\nCreep Memory:");
    for (const name in Game.creeps) {
      const creep = Game.creeps[name];
      console.log(`${name} (${creep.memory.role}):`);
      console.log(JSON.stringify(creep.memory, null, 2));
    }

    console.log("===== END MEMORY DUMP =====");
    return "OK";
  },

  /**
   * Print current cycle information
   */
  printCycle: function () {
    if (!Memory.cycle) {
      console.log("Cycle manager not initialized");
      return "ERROR";
    }

    console.log("===== CYCLE STATUS =====");
    console.log(`Start Tick: ${Memory.cycle.startTick}`);
    console.log(`Current Phase: ${Memory.cycle.currentPhase}`);
    console.log(`Elapsed Ticks: ${Memory.cycle.elapsedTicks}`);
    console.log(`Last Spawn Tick: ${Memory.cycle.lastSpawnTick}`);

    console.log("\nScheduled Spawns:");
    for (const variant in Memory.cycle.scheduledSpawns) {
      const data = Memory.cycle.scheduledSpawns[variant];
      console.log(
        `- ${variant}: ${data.quantity}x remaining (${data.energy} energy)`
      );
    }

    console.log("===== END CYCLE STATUS =====");
    return "OK";
  },

  /**
   * Skip to a specific tick in the cycle (for testing)
   */
  skipToTick: function (targetTick) {
    if (!Memory.cycle) {
      console.log("Cycle manager not initialized");
      return "ERROR";
    }

    if (typeof targetTick !== "number" || targetTick < 0) {
      console.log("Invalid tick number. Please provide a positive number.");
      return "ERROR";
    }

    // Calculate the new start tick that would make elapsedTicks = targetTick
    const newStartTick = Game.time - targetTick;

    console.log(`Skipping to tick ${targetTick}`);
    Memory.cycle.startTick = newStartTick;
    Memory.cycle.elapsedTicks = targetTick;

    // Clear scheduled spawns (will be repopulated on next update)
    Memory.cycle.scheduledSpawns = {};

    console.log(`Time travel complete. Elapsed ticks is now ${targetTick}`);
    return "OK";
  },

  /**
   * Register all console commands for easy access from the console
   */
  registerGlobals: function () {
    // Make these functions available globally for the console
    global.reset = this.reset;
    global.printMem = this.printMem;
    global.printCycle = this.printCycle;
    global.skipToTick = this.skipToTick;

    console.log(
      "Console commands registered globally. Available commands: reset, printMem, printCycle, skipToTick"
    );
  },
};

module.exports = consoleCommands;
