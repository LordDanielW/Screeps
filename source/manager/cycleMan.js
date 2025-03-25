const SpawnSchedule = require("spawnScheduleRoomW7N3");
/**
 * CycleManager - Manages the game's spawn cycle based on a predefined schedule
 */
module.exports = {
  // The spawn schedule will be loaded from JSON
  // SpawnSchedule: null,

  /**
   * Initialize the cycle manager
   * Must be called once at the start of the game
   */
  initialize: function () {
    if (!Memory.cycle) {
      Memory.cycle = {
        startTick: Game.time,
        currentPhase: 1,
        elapsedTicks: 0,
        lastSpawnTick: 0,
        scheduledSpawns: {},
      };
    }

    // Load the spawn schedule data
    // this.loadSchedule();
  },

  /**
   * Load the spawn schedule from the JSON data
   */
  // loadSchedule: function () {
  //   try {
  //     // In actual Screeps, this would use require() to load the JSON file
  //     SpawnSchedule = require("SpawnSchedule");
  //     console.log("Spawn schedule loaded successfully");
  //   } catch (e) {
  //     console.log("ERROR: Failed to load spawn schedule:", e);
  //   }
  // },

  /**
   * Update the cycle manager state
   * Should be called every tick in the main loop
   */
  update: function () {
    // Update elapsed ticks
    Memory.cycle.elapsedTicks = Game.time - Memory.cycle.startTick;

    // Determine current phase based on elapsed ticks
    this.updateCurrentPhase();

    // Schedule any creeps that need to be spawned on this tick
    this.scheduleCreepsForCurrentTick();
  },

  /**
   * Update the current phase based on elapsed ticks
   */
  updateCurrentPhase: function () {
    // if (!SpawnSchedule) return;

    const elapsedTicks = Memory.cycle.elapsedTicks;

    // Find the correct phase for the current tick
    for (const phase of SpawnSchedule.phases) {
      if (elapsedTicks >= phase.startTick && elapsedTicks <= phase.endTick) {
        if (Memory.cycle.currentPhase !== phase.id) {
          console.log(`Transitioning to phase ${phase.id}: ${phase.name}`);
          Memory.cycle.currentPhase = phase.id;
        }
        return;
      }
    }
  },

  /**
   * Schedule creeps that need to be spawned on the current tick
   */
  scheduleCreepsForCurrentTick: function () {
    // if (!SpawnSchedule) return;

    const elapsedTicks = Memory.cycle.elapsedTicks;
    const phase = this.getCurrentPhaseData();

    if (!phase) return;

    // Clear the scheduled spawns
    Memory.cycle.scheduledSpawns = {};

    // Find all spawns that should happen at the current tick
    for (const spawn of phase.spawns) {
      if (spawn.tick === elapsedTicks) {
        const variant = spawn.variant;

        // Get the body and role from our variant definitions
        const variantInfo = SpawnSchedule.variants[variant];
        if (!variantInfo) {
          console.log(`WARNING: No variant info found for ${variant}`);
          continue;
        }

        // Schedule this spawn
        Memory.cycle.scheduledSpawns[variant] = {
          variant: variant,
          role: variantInfo.role,
          body: variantInfo.body,
          energy: variantInfo.energy,
          quantity: spawn.quantity || 1,
          memory: { role: variantInfo.role, variant: variant },
        };

        console.log(`Scheduled ${spawn.quantity || 1}x ${variant} for spawn`);
      }
    }

    // Check for any events that should happen at this tick
    for (const event of SpawnSchedule.events || []) {
      if (event.tick === elapsedTicks) {
        console.log(`EVENT: ${event.type} - ${event.notes}`);
      }
    }
  },

  /**
   * Get the current phase data
   * @returns {Object|null} The current phase data or null
   */
  getCurrentPhaseData: function () {
    if (!SpawnSchedule) return null;

    const currentPhaseId = Memory.cycle.currentPhase;
    return SpawnSchedule.phases.find((phase) => phase.id === currentPhaseId);
  },

  /**
   * Get the next creep that should be spawned
   * @param {Room} room - The room to spawn in
   * @returns {Object|null} The next creep to spawn or null
   */
  getNextCreepToSpawn: function (room) {
    if (!Memory.cycle.scheduledSpawns) return null;

    // Check if we have anything scheduled
    for (const variantName in Memory.cycle.scheduledSpawns) {
      const spawnData = Memory.cycle.scheduledSpawns[variantName];

      // Skip if we've already spawned the required quantity
      if (spawnData.quantity <= 0) continue;

      // Check if we have enough energy
      if (room.energyAvailable < spawnData.energy) continue;

      // Return this variant
      return variantName;
    }

    return null;
  },

  /**
   * Get the creep configuration for a specific variant
   * @param {string} variant - The variant name
   * @returns {Object|null} The creep configuration or null
   */
  getCreepConfig: function (variant) {
    if (!SpawnSchedule) return null;

    // Get from scheduled spawns first
    if (Memory.cycle.scheduledSpawns[variant]) {
      const spawnData = Memory.cycle.scheduledSpawns[variant];
      return {
        role: spawnData.role,
        config: {
          body: spawnData.body,
          memory: spawnData.memory,
          minEnergy: spawnData.energy,
        },
      };
    }

    // Fall back to variant definition
    const variantInfo = SpawnSchedule.variants[variant];
    if (variantInfo) {
      return {
        role: variantInfo.role,
        config: {
          body: variantInfo.body,
          memory: { role: variantInfo.role, variant: variant },
          minEnergy: variantInfo.energy,
        },
      };
    }

    return null;
  },

  /**
   * Mark that a creep has been spawned
   * @param {string} variant - The variant that was spawned
   */
  markSpawned: function (variant) {
    if (!Memory.cycle.scheduledSpawns[variant]) return;

    // Decrement the quantity
    Memory.cycle.scheduledSpawns[variant].quantity--;

    // Remove if we've spawned them all
    if (Memory.cycle.scheduledSpawns[variant].quantity <= 0) {
      delete Memory.cycle.scheduledSpawns[variant];
    }

    Memory.cycle.lastSpawnTick = Game.time;
  },

  /**
   * Get elapsed ticks since the start of the speed run
   * @returns {number} - Number of elapsed ticks
   */
  getElapsedTicks: function () {
    return Memory.cycle.elapsedTicks;
  },

  /**
   * Get current phase
   * @returns {number} - Current phase ID
   */
  getCurrentPhase: function () {
    return Memory.cycle.currentPhase;
  },

  /**
   * Get variant body parts from our schedule
   * @param {string} variant - The variant name to look up
   * @returns {Object|null} - The body parts configuration
   */
  getVariantBody: function (variant) {
    if (!SpawnSchedule || !SpawnSchedule.variants[variant]) {
      return null;
    }

    return SpawnSchedule.variants[variant].body;
  },

  /**
   * Helper function to convert body parts object to array
   * @param {Object} bodyParts - Body parts object {work: 2, move: 1, etc}
   * @returns {Array} - Array of body parts ["work", "work", "move"]
   */
  bodyPartsToArray: function (bodyParts) {
    const result = [];

    // Add parts in the optimal order
    const partOrder = [
      "tough",
      "claim",
      "work",
      "carry",
      "attack",
      "ranged_attack",
      "heal",
      "move",
    ];

    for (const part of partOrder) {
      const count = bodyParts[part] || 0;
      for (let i = 0; i < count; i++) {
        result.push(part);
      }
    }

    return result;
  },
};
