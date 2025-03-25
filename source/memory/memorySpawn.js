/**
 * @typedef {Object} SpawnRequest
 * @property {string} variant - The creep variant to spawn
 * @property {number} priority - Priority of this request (lower number = higher priority)
 * @property {number} [tick] - The game tick when this request was made
 * @property {Object} [memory] - Additional memory to merge with the creep's memory
 * @property {Array<number>} [directions] - Preferred spawn directions
 * @property {string} [targetRoom] - Target room for this creep
 */

/**
 * @typedef {Object} SpawnMemory
 * @property {Array<SpawnRequest>} queue - Queue of spawn requests
 * @property {Object} history - History of spawn operations
 * @property {number} lastSpawnTime - Last time this spawn created a creep
 */

/**
 * Memory utilities for spawns
 */
module.exports = {
  /**
   * Initialize spawn memory
   * @param {StructureSpawn} spawn - The spawn to initialize memory for
   */
  initialize: function (spawn) {
    if (!Memory.spawns) {
      Memory.spawns = {};
    }

    if (!Memory.spawns[spawn.name]) {
      Memory.spawns[spawn.name] = {
        queue: [],
        history: {},
        lastSpawnTime: 0,
      };
    }
  },

  /**
   * Add a spawn request to the queue
   * @param {StructureSpawn} spawn - The spawn to add the request to
   * @param {string} variant - The creep variant to spawn
   * @param {number} priority - Priority (lower = higher priority)
   * @param {Object} memory - Additional memory for the creep
   * @param {Array<number>} directions - Preferred spawn directions
   * @returns {boolean} - Whether the request was added
   */
  queueCreep: function (
    spawn,
    variant,
    priority = 5,
    memory = {},
    directions = []
  ) {
    if (!Memory.spawns[spawn.name]) {
      this.initialize(spawn);
    }

    const request = {
      variant: variant,
      priority: priority,
      tick: Game.time,
      memory: memory,
      directions: directions,
    };

    Memory.spawns[spawn.name].queue.push(request);

    // Sort queue by priority
    Memory.spawns[spawn.name].queue.sort((a, b) => a.priority - b.priority);
    return true;
  },

  /**
   * Get the next spawn request
   * @param {StructureSpawn} spawn - The spawn to get the next request for
   * @returns {SpawnRequest|null} - The next spawn request or null
   */
  getNextRequest: function (spawn) {
    if (
      !Memory.spawns[spawn.name] ||
      Memory.spawns[spawn.name].queue.length === 0
    ) {
      return null;
    }

    return Memory.spawns[spawn.name].queue[0];
  },

  /**
   * Remove a request from the queue
   * @param {StructureSpawn} spawn - The spawn to remove the request from
   * @param {number} index - The index of the request to remove
   */
  removeRequest: function (spawn, index = 0) {
    if (
      !Memory.spawns[spawn.name] ||
      Memory.spawns[spawn.name].queue.length <= index
    ) {
      return;
    }

    const request = Memory.spawns[spawn.name].queue[index];
    Memory.spawns[spawn.name].queue.splice(index, 1);

    // Add to history
    if (!Memory.spawns[spawn.name].history[Game.time]) {
      Memory.spawns[spawn.name].history[Game.time] = [];
    }
    Memory.spawns[spawn.name].history[Game.time].push(request);

    // Clean old history
    this.cleanHistory(spawn);
  },

  /**
   * Clean spawn history older than 1000 ticks
   * @param {StructureSpawn} spawn - The spawn to clean history for
   */
  cleanHistory: function (spawn) {
    const history = Memory.spawns[spawn.name].history;
    const cutoff = Game.time - 1000;

    for (const tick in history) {
      if (tick < cutoff) {
        delete history[tick];
      }
    }
  },

  /**
   * Clear all spawn queues
   */
  clearAllQueues: function () {
    for (const spawnName in Memory.spawns) {
      Memory.spawns[spawnName].queue = [];
    }
  },
};
