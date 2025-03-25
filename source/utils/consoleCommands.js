// utils/consoleCommands.js
const consoleCommands = {
  /**
   * Restart the game by killing all creeps and resetting stats
   */
  restart: function () {
    console.log("Executing restart command...");

    // Kill all creeps
    for (const name in Game.creeps) {
      console.log(`Killing creep: ${name}`);
      Game.creeps[name].suicide();
    }

    // Reset stats
    Memory.stats = {};

    // Clear creep memory to avoid memory leaks
    for (const name in Memory.creeps) {
      if (!Game.creeps[name]) {
        console.log(`Clearing memory for creep: ${name}`);
        delete Memory.creeps[name];
      }
    }

    console.log("Restart completed. All creeps terminated and stats reset.");
    return "OK";
  },

  /**
   * Print out Memory as JSON, and all creeps memory
   */
  printMemory: function () {
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
   * Register all console commands for easy access from the console
   */
  registerGlobals: function () {
    // Make these functions available globally for the console
    global.restart = this.restart;
    global.printMemory = this.printMemory;

    console.log(
      "Console commands registered globally. Available commands: restart, printMemory"
    );
  },
};

module.exports = consoleCommands;
