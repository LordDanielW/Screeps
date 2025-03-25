const cycleManager = require("cycleMan");
const memoryCreep = require("memoryCreep");

/**
 * CreepFactory - Handles the spawning of creeps based on cycle manager data
 */
module.exports = {
  /**
   * Run the factory for a given room
   * @param {Room} room - The room to spawn in
   */
  run: function (room) {
    const spawn = room.find(FIND_MY_SPAWNS)[0];
    if (!spawn || spawn.spawning) {
      return;
    }

    // Ask the cycle manager what to spawn next
    const variantToSpawn = cycleManager.getNextCreepToSpawn(room);

    if (variantToSpawn) {
      const result = this.spawnCreep(spawn, variantToSpawn, room);

      if (result === OK) {
        // Mark as spawned in the cycle manager
        cycleManager.markSpawned(variantToSpawn);
        console.log(`Spawning ${variantToSpawn} in ${room.name}`);
      } else {
        console.log(
          `Failed to spawn ${variantToSpawn} in ${room.name}: ${result}`
        );
      }
    }
  },

  /**
   * Spawn a creep with the specified variant
   * @param {StructureSpawn} spawn - The spawn to use
   * @param {string} variant - The variant name to spawn
   * @param {Room} room - The room to spawn in
   * @returns {number} - Spawn result code (OK or error code)
   */
  spawnCreep: function (spawn, variant, room) {
    // Get the creep configuration from the cycle manager
    const creepInfo = cycleManager.getCreepConfig(variant);
    if (!creepInfo) {
      console.log(`ERROR: No configuration found for variant ${variant}`);
      return ERR_INVALID_ARGS;
    }

    const config = creepInfo.config;
    const role = creepInfo.role;

    // Check if we have enough energy
    if (room.energyAvailable < config.minEnergy) {
      return ERR_NOT_ENOUGH_ENERGY;
    }

    // Convert body parts object to array
    const body = cycleManager.bodyPartsToArray(config.body);

    // Generate a unique name
    const name = `${variant}_${Game.time}`;

    // Prepare base memory
    const baseMemory = {
      role: role,
      variant: variant,
      homeRoom: room.name,
    };

    // Merge with additional memory from config
    const memory = Object.assign({}, baseMemory, config.memory || {});

    // We can choose preferred spawn directions based on role
    let directions = [
      TOP,
      TOP_RIGHT,
      RIGHT,
      BOTTOM_RIGHT,
      BOTTOM,
      BOTTOM_LEFT,
      LEFT,
      TOP_LEFT,
    ];

    // For miners, try to spawn toward their likely destination
    if (role === "miner" && !room.memory.minerDirections) {
      // Initialize miner directions if not set
      this.initMinerDirections(room);
    }

    if (role === "miner" && room.memory.minerDirections) {
      const minerCount = memoryCreep.countByRole("miner", room.name);
      if (room.memory.minerDirections[minerCount]) {
        directions = [room.memory.minerDirections[minerCount]];
      }
    }

    // Spawn the creep
    const result = spawn.spawnCreep(body, name, {
      memory: memory,
      directions: directions,
    });

    // Initialize memory if spawn is successful
    if (result === OK) {
      memoryCreep.initialize(Game.creeps[name], role, variant, memory);
    }

    return result;
  },

  /**
   * Initialize miner directions based on source positions
   * @param {Room} room - The room to initialize
   */
  initMinerDirections: function (room) {
    if (!room.memory.minerDirections) {
      room.memory.minerDirections = {};
    }

    const spawn = room.find(FIND_MY_SPAWNS)[0];
    if (!spawn) return;

    const sources = room.find(FIND_SOURCES);
    sources.sort((a, b) => {
      return (
        this.getDistance(spawn.pos, a.pos) - this.getDistance(spawn.pos, b.pos)
      );
    });

    for (let i = 0; i < sources.length; i++) {
      const source = sources[i];
      // Determine rough direction from spawn to source
      const dx = source.pos.x - spawn.pos.x;
      const dy = source.pos.y - spawn.pos.y;

      let direction;
      if (Math.abs(dx) > Math.abs(dy) * 2) {
        // Primarily east/west
        direction = dx > 0 ? RIGHT : LEFT;
      } else if (Math.abs(dy) > Math.abs(dx) * 2) {
        // Primarily north/south
        direction = dy > 0 ? BOTTOM : TOP;
      } else {
        // Diagonal
        if (dx > 0 && dy > 0) direction = BOTTOM_RIGHT;
        else if (dx > 0 && dy < 0) direction = TOP_RIGHT;
        else if (dx < 0 && dy > 0) direction = BOTTOM_LEFT;
        else direction = TOP_LEFT;
      }

      room.memory.minerDirections[i] = direction;
    }
  },

  /**
   * Simple distance calculation
   * @param {RoomPosition} pos1 - First position
   * @param {RoomPosition} pos2 - Second position
   * @returns {number} - Manhattan distance
   */
  getDistance: function (pos1, pos2) {
    return Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y);
  },
};
