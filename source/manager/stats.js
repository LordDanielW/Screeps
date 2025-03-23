module.exports = {
  collect: function (room) {
    if (!Memory.speedRun.stats) {
      Memory.speedRun.stats = {
        energyMined: 0,
        energyUsed: 0,
        idleTicks: {
          byCreep: {},
          spawn: 0,
        },
        currentValues: {
          energyHarvested: 0,
          energySpent: 0,
        },
      };
    }

    // Track energy mining
    const miners = _.filter(
      Game.creeps,
      (c) => c.memory.role === "miner" && c.room.name === room.name
    );

    // Each WORK part mines 2 energy per tick
    const miningRate = miners.reduce((total, miner) => {
      return total + miner.getActiveBodyparts(WORK) * 2;
    }, 0);

    // Add mining rate to total
    Memory.speedRun.stats.energyMined += miningRate;
    Memory.speedRun.stats.currentValues.energyHarvested = miningRate;

    // Track energy usage (spawning, building, upgrading)
    let energyUsed = 0;

    // Spawning
    const spawn = room.find(FIND_MY_SPAWNS)[0];
    if (spawn && spawn.spawning) {
      // Calculate energy cost of spawning creep
      const spawningCreep = Game.creeps[spawn.spawning.name];
      if (spawningCreep) {
        const bodyCost = this.calculateBodyCost(spawningCreep.body);
        // Amortize the cost over the spawn time
        energyUsed += bodyCost / CREEP_SPAWN_TIME;
      }
    } else if (spawn) {
      // Track spawn idle time
      Memory.speedRun.stats.idleTicks.spawn++;
    }

    // Building
    const builders = _.filter(
      Game.creeps,
      (c) => c.memory.role === "build" && c.room.name === room.name
    );

    for (const builder of builders) {
      // Each active WORK part uses 5 energy per tick when building
      const buildPower = builder.getActiveBodyparts(WORK) * 5;
      // Only count if the builder is actively building (has energy)
      if (builder.store[RESOURCE_ENERGY] > 0 && builder.memory.building) {
        energyUsed += buildPower;
      }
    }

    // Upgrading
    const upgraders = _.filter(
      Game.creeps,
      (c) => c.memory.role === "upgrade" && c.room.name === room.name
    );

    for (const upgrader of upgraders) {
      // Each active WORK part uses 1 energy per tick when upgrading
      const upgradePower = upgrader.getActiveBodyparts(WORK);
      // Only count if the upgrader is actively upgrading (has energy)
      if (upgrader.store[RESOURCE_ENERGY] > 0) {
        energyUsed += upgradePower;
      }
    }

    // Add to total energy used
    Memory.speedRun.stats.energyUsed += energyUsed;
    Memory.speedRun.stats.currentValues.energySpent = energyUsed;

    // Track idle creeps
    for (const name in Game.creeps) {
      const creep = Game.creeps[name];
      if (creep.room.name === room.name) {
        if (creep.memory.idle) {
          Memory.speedRun.stats.idleTicks.byCreep[name] =
            (Memory.speedRun.stats.idleTicks.byCreep[name] || 0) + 1;
        }
      }
    }
  },

  calculateBodyCost: function (body) {
    return body.reduce((cost, part) => {
      return cost + BODYPART_COST[part.type];
    }, 0);
  },
};
