// Modify the require to conditionally load the right schedule
const gameMode = "worldplay"; // or 'speedrun'

const getSpawnSchedule = function () {
  // Check game mode from memory
  if (gameMode === "speedrun") {
    return require("spawnScheduleRoomW7N3");
  } else {
    return require("spawnScheduleDynamic");
  }
};

/**
 * CycleManager - Manages the game's spawn cycle
 */
module.exports = {
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

    // Cache the chosen schedule
    this.spawnSchedule = getSpawnSchedule();
  },

  update: function () {
    // Update elapsed ticks
    Memory.cycle.elapsedTicks = Game.time - Memory.cycle.startTick;
    this.updateCurrentPhase();

    // Different scheduling based on game mode
    if (gameMode === "speedrun") {
      this.scheduleCreepsForCurrentTick();
    } else {
      this.scheduleDynamicCreeps();
    }
  },

  updateCurrentPhase: function () {
    const elapsedTicks = Memory.cycle.elapsedTicks;

    for (const phase of this.spawnSchedule.phases) {
      if (elapsedTicks >= phase.startTick && elapsedTicks <= phase.endTick) {
        if (Memory.cycle.currentPhase !== phase.id) {
          console.log(`Transitioning to phase ${phase.id}: ${phase.name}`);
          Memory.cycle.currentPhase = phase.id;
        }
        return;
      }
    }
  },

  // Keep the original method for speed runs
  scheduleCreepsForCurrentTick: function () {
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
        const variantInfo = this.spawnSchedule.variants[variant];
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
    for (const event of this.spawnSchedule.events || []) {
      if (event.tick === elapsedTicks) {
        console.log(`EVENT: ${event.type} - ${event.notes}`);
      }
    }
  },

  // New method for dynamic spawning
  scheduleDynamicCreeps: function () {
    const phase = this.getCurrentPhaseData();
    if (!phase || !phase.targets) return;

    // Clear the scheduled spawns each tick
    Memory.cycle.scheduledSpawns = {};

    // Get all rooms we control
    const myRooms = Object.values(Game.rooms).filter(
      (r) => r.controller && r.controller.my
    );

    // For each room, analyze needs
    for (const room of myRooms) {
      this.analyzeDynamicNeeds(room, phase);
    }
  },

  analyzeDynamicNeeds: function (room, phase) {
    // Count existing creeps by role
    const counts = {};
    for (const role in phase.targets) {
      counts[role] = _.filter(
        Game.creeps,
        (c) =>
          c.memory.role === role &&
          (c.memory.homeRoom === room.name || !c.memory.homeRoom)
      ).length;
    }

    // Sort targets by priority
    const targets = Object.entries(phase.targets).sort(
      (a, b) => b[1].priority - a[1].priority
    );

    // Check each target role
    for (const [role, target] of targets) {
      // Skip if we have enough
      if (counts[role] >= target.minCount) continue;

      // Determine which variant to use based on conditions
      let selectedVariant = null;

      // Check all conditions
      if (target.conditions) {
        // Energy-based variant selection
        if (target.conditions.energyCheck) {
          selectedVariant = target.conditions.energyCheck(room);
        }

        // Skip if other conditions aren't met
        if (
          target.conditions.constructionCheck &&
          !target.conditions.constructionCheck(room)
        ) {
          continue;
        }

        if (
          target.conditions.storageCheck &&
          !target.conditions.storageCheck(room)
        ) {
          // If storage check fails, use minimum count instead of max
          if (counts[role] >= target.minCount) continue;
        }

        if (
          target.conditions.needsReserving &&
          !target.conditions.needsReserving(room)
        ) {
          continue;
        }
      }

      // If no variant was selected by conditions, use the first one
      if (!selectedVariant && target.variants && target.variants.length > 0) {
        selectedVariant = target.variants[0];
      }

      // Skip if no valid variant
      if (!selectedVariant) continue;

      // Get variant info
      const variantInfo = this.spawnSchedule.variants[selectedVariant];
      if (!variantInfo) {
        console.log(`WARNING: No variant info found for ${selectedVariant}`);
        continue;
      }

      // Schedule this spawn
      Memory.cycle.scheduledSpawns[selectedVariant] = {
        variant: selectedVariant,
        role: variantInfo.role,
        body: variantInfo.body,
        energy: variantInfo.energy,
        quantity: 1,
        memory: {
          role: variantInfo.role,
          variant: selectedVariant,
          homeRoom: room.name,
        },
      };

      console.log(`Scheduled 1x ${selectedVariant} for ${room.name}`);

      // Only schedule one creep at a time
      break;
    }
  },

  // The rest of your methods remain the same
  /**
   * Get the current phase data
   * @returns {Object|null} The current phase data or null
   */
  getCurrentPhaseData: function () {
    const currentPhaseId = Memory.cycle.currentPhase;
    return this.spawnSchedule.phases.find(
      (phase) => phase.id === currentPhaseId
    );
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
    const variantInfo = this.spawnSchedule.variants[variant];
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
    if (!this.spawnSchedule.variants[variant]) {
      return null;
    }

    return this.spawnSchedule.variants[variant].body;
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

  // Helper to get the current schedule
  getSpawnSchedule: function () {
    return this.spawnSchedule;
  },
};
