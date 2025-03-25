const factory = require("factory");
const memoryCreep = require("memoryCreep");
const memorySpawn = require("memorySpawn");

/**
 * SpawnManager - Manages all spawns in the game
 */
module.exports = {
  /**
   * Run the spawn manager
   * This should be called every tick
   */
  run: function () {
    // Clean up memory for non-existent creeps
    memoryCreep.cleanup();

    // Track idle spawns for stats
    let allSpawnsIdle = true;

    // Process each spawn in the game
    for (const spawnName in Game.spawns) {
      const spawn = Game.spawns[spawnName];

      // Initialize spawn memory if needed
      memorySpawn.initialize(spawn);

      // Skip if this spawn is already spawning
      if (spawn.spawning) {
        allSpawnsIdle = false;
        continue;
      }

      // Let the factory handle the actual spawning
      this.handleSpawn(spawn);

      // Update whether all spawns were idle
      if (spawn.spawning) {
        allSpawnsIdle = false;
      }
    }

    // Update spawn statistics
    // memorySpawn.updateStats(allSpawnsIdle);
  },

  /**
   * Handle a single spawn
   * @param {StructureSpawn} spawn - The spawn to process
   */
  handleSpawn: function (spawn) {
    // Check if we have any emergency spawns (e.g., no miners)
    // if (this.handleEmergencySpawns(spawn)) {
    //   return; // Emergency spawn was created
    // }

    // Let the factory run - it will check with cycle manager
    factory.run(spawn.room);
  },

  /**
   * Handle emergency spawns when critical creeps are missing
   * @param {StructureSpawn} spawn - The spawn to use
   * @returns {boolean} - Whether an emergency spawn was created
   */
  handleEmergencySpawns: function (spawn) {
    const room = spawn.room;

    // Check for miners - we always need at least one
    const miners = memoryCreep.getCreepsByRole("miner", room.name);

    // If no miners at all, spawn a basic miner immediately
    if (miners.length === 0) {
      const result = this.spawnEmergencyMiner(spawn);
      return result === OK;
    }

    return false;
  },

  /**
   * Spawn an emergency miner when all miners are dead
   * @param {StructureSpawn} spawn - The spawn to use
   * @returns {number} - Spawn result code
   */
  spawnEmergencyMiner: function (spawn) {
    const energyAvailable = spawn.room.energyAvailable;
    let body = [];

    // Scale the body based on available energy
    if (energyAvailable >= 300) {
      // minerTiny - 3 WORK
      body = [WORK, WORK, WORK];
    } else if (energyAvailable >= 250) {
      // minerStart - 2 WORK, 1 CARRY
      body = [WORK, WORK, CARRY];
    } else if (energyAvailable >= 200) {
      // Minimal - 2 WORK
      body = [WORK, WORK];
    } else {
      // Absolute minimum - 1 WORK, 1 CARRY
      body = [WORK, CARRY];
    }

    const name = `EmergencyMiner_${Game.time}`;

    console.log(`EMERGENCY: Spawning backup miner with ${body.length} parts`);

    return spawn.spawnCreep(body, name, {
      memory: {
        role: "miner",
        variant: "emergency",
        emergency: true,
      },
    });
  },

  /**
   * Find the best source for a miner to work on
   * @param {StructureSpawn} spawn - The spawn
   * @param {Array<Source>} sources - Available sources
   * @returns {Source|null} - The best source or null
   */
  findBestSource: function (spawn, sources) {
    if (!sources || sources.length === 0) return null;

    // Get all miners
    const miners = memoryCreep.getCreepsByRole("miner");

    // Find unoccupied sources first
    for (const source of sources) {
      let isOccupied = false;
      for (const miner of miners) {
        if (miner.memory.sourceId === source.id) {
          isOccupied = true;
          break;
        }
      }

      if (!isOccupied) {
        return source;
      }
    }

    // If all sources are occupied, find the one with the fewest miners
    const sourceCount = {};
    for (const source of sources) {
      sourceCount[source.id] = 0;
    }

    for (const miner of miners) {
      if (
        miner.memory.sourceId &&
        sourceCount[miner.memory.sourceId] !== undefined
      ) {
        sourceCount[miner.memory.sourceId]++;
      }
    }

    // Find source with minimum miners
    let minCount = Infinity;
    let bestSource = null;

    for (const sourceId in sourceCount) {
      if (sourceCount[sourceId] < minCount) {
        minCount = sourceCount[sourceId];
        bestSource = Game.getObjectById(sourceId);
      }
    }

    return bestSource;
  },
};
