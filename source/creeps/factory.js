const cycleManager = require("cycle");

module.exports = {
  run: function (room) {
    const spawn = room.find(FIND_MY_SPAWNS)[0];
    if (!spawn || spawn.spawning) return;

    // Ask the cycle manager what to spawn next
    const variantToSpawn = cycleManager.getNextCreepToSpawn(room);

    if (variantToSpawn) {
      this.spawnCreep(spawn, variantToSpawn, room);
    }
  },

  spawnCreep: function (spawn, variant, room) {
    // Get the creep configuration from the cycle manager
    const creepInfo = cycleManager.getCreepConfig(variant);
    if (!creepInfo) return;

    const config = creepInfo.config;
    const role = creepInfo.role;

    // Check if we have enough energy
    if (room.energyAvailable < config.minEnergy) return;

    // Check if RCL is high enough
    if (room.controller.level > config.maxRcl) return;

    // Build the body array
    const body = [];
    for (const part in config.body) {
      for (let i = 0; i < config.body[part]; i++) {
        body.push(part);
      }
    }

    // Create a copy of the memory object
    const memory = Object.assign({}, config.memory);

    // Set up specialized memory properties based on role
    if (role === "miner") {
      // Assign to a source
      const sources = spawn.room.find(FIND_SOURCES);
      const miners = _.filter(Game.creeps, (c) => c.memory.role === "miner");
      const sourceIds = miners.map((m) => m.memory.sourceId);

      for (const source of sources) {
        if (!sourceIds.includes(source.id)) {
          memory.sourceId = source.id;
          break;
        }
      }

      // If all sources have miners, distribute evenly
      if (!memory.sourceId) {
        const sourceIndex = miners.length % sources.length;
        memory.sourceId = sources[sourceIndex].id;
      }
    }

    // Generate a unique name
    const name = variant + Game.time;

    // Spawn the creep
    return spawn.spawnCreep(body, name, { memory: memory });
  },

  // Add a method to create custom variants
  registerCustomVariant: function (
    variantName,
    role,
    bodyConfig,
    memoryConfig,
    minEnergy,
    maxRcl
  ) {
    if (!cycleManager.creepVariants[role]) {
      cycleManager.creepVariants[role] = {};
    }

    cycleManager.creepVariants[role][variantName] = {
      body: bodyConfig,
      memory: Object.assign({ role: role, variant: variantName }, memoryConfig),
      minEnergy: minEnergy,
      maxRcl: maxRcl,
    };

    console.log(`Registered custom variant: ${variantName}`);
  },
};
