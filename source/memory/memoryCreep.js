/**
 * @typedef {Object} CreepMemory
 * @property {string} role - The role of the creep (miner, mover, carry, upgrade, build)
 * @property {string} variant - The body variant of the creep (minerTiny, minerSmall, etc.)
 * @property {boolean} idle - Whether the creep is currently idle
 * @property {boolean} positioned - Whether the creep is in position (for stationary creeps)
 * @property {string} [sourceId] - ID of assigned energy source
 * @property {string} [targetId] - ID of current target
 * @property {string} [task] - Current task (harvest, deliver, build, etc.)
 * @property {string} [destinationId] - ID of destination (for movers)
 * @property {Object} [path] - Path data
 * @property {Array<RoomPosition>} [path.waypoints] - Path waypoints
 * @property {number} [path.nextWaypoint] - Index of next waypoint
 * @property {Object} stats - Creep performance statistics
 * @property {number} stats.idleTicks - Number of ticks the creep has been idle
 * @property {boolean} [special] - Whether this is a special variant creep
 * @property {string} [homeRoom] - Name of the creep's home room
 * @property {string} [workRoom] - Name of the room the creep should work in
 * @property {number} [birthTime] - Game.time when this creep was spawned
 * @property {boolean} [recycle] - Whether this creep should be recycled
 */

/**
 * Memory utilities for creeps
 */
module.exports = {
  /**
   * Initialize creep memory with role-specific defaults
   * @param {Creep} creep - The creep to initialize memory for
   * @param {string} role - The role the creep should have
   * @param {string} variant - The variant of the creep
   * @param {Object} additionalMemory - Additional memory to merge
   */
  initialize: function (creep, role, variant, additionalMemory = {}) {
    // Base memory all creeps share
    const baseMemory = {
      role: role,
      variant: variant,
      idle: false,
      positioned: false,
      stats: {
        idleTicks: 0,
      },
      birthTime: Game.time,
      homeRoom: creep.room.name,
    };

    // Role-specific default memory
    let roleMemory = {};

    switch (role) {
      case "miner":
        roleMemory = {
          sourceId: null,
          task: "harvest",
        };
        break;
      case "carry":
        roleMemory = {
          task: "pickup",
        };
        break;
      case "upgrade":
        roleMemory = {
          targetId: creep.room.controller.id,
          task: "upgrade",
        };
        break;
      case "build":
        roleMemory = {
          task: "build",
        };
        break;
      case "mover":
        roleMemory = {
          task: "transfer",
          path: {
            waypoints: [],
            nextWaypoint: 0,
          },
        };
        break;
    }

    // Combine all memory objects
    creep.memory = Object.assign({}, baseMemory, roleMemory, additionalMemory);
  },

  /**
   * Get creeps filtered by role
   * @param {string} role - Role to filter by
   * @param {string} [roomName] - Optional room to filter by
   * @returns {Array<Creep>} - Array of creeps with the specified role
   */
  getCreepsByRole: function (role, roomName) {
    if (roomName) {
      return _.filter(
        Game.creeps,
        (creep) => creep.memory.role === role && creep.room.name === roomName
      );
    }
    return _.filter(Game.creeps, (creep) => creep.memory.role === role);
  },

  /**
   * Get creeps filtered by variant
   * @param {string} variant - Variant to filter by
   * @param {string} [roomName] - Optional room to filter by
   * @returns {Array<Creep>} - Array of creeps with the specified variant
   */
  getCreepsByVariant: function (variant, roomName) {
    if (roomName) {
      return _.filter(
        Game.creeps,
        (creep) =>
          creep.memory.variant === variant && creep.room.name === roomName
      );
    }
    return _.filter(Game.creeps, (creep) => creep.memory.variant === variant);
  },

  /**
   * Find idle creeps
   * @param {string} [role] - Optional role to filter by
   * @returns {Array<Creep>} - Array of idle creeps
   */
  getIdleCreeps: function (role) {
    if (role) {
      return _.filter(
        Game.creeps,
        (creep) => creep.memory.idle === true && creep.memory.role === role
      );
    }
    return _.filter(Game.creeps, (creep) => creep.memory.idle === true);
  },

  /**
   * Update creep statistics
   * @param {Creep} creep - The creep to update stats for
   */
  updateStats: function (creep) {
    if (creep.memory.idle) {
      creep.memory.stats.idleTicks++;
    }
  },

  /**
   * Count creeps by role
   * @param {string} role - Role to count
   * @param {string} [roomName] - Optional room to filter by
   * @returns {number} - Count of creeps with that role
   */
  countByRole: function (role, roomName) {
    return this.getCreepsByRole(role, roomName).length;
  },

  /**
   * Count creeps by variant
   * @param {string} variant - Variant to count
   * @param {string} [roomName] - Optional room to filter by
   * @returns {number} - Count of creeps with that variant
   */
  countByVariant: function (variant, roomName) {
    return this.getCreepsByVariant(variant, roomName).length;
  },

  /**
   * Clean up memory for non-existent creeps
   */
  cleanup: function () {
    for (const name in Memory.creeps) {
      if (!Game.creeps[name]) {
        delete Memory.creeps[name];
      }
    }
  },
};
