module.exports = {
  run: function () {
    // Loop through all spawns
    for (const spawnName in Game.spawns) {
      const spawner = Game.spawns[spawnName];
      this.handleSpawn(spawner);
    }
  },

  handleSpawn: function (spawner) {
    // Define the creep bodies
    const minerStartBody = [WORK, WORK, CARRY]; // minerStart body
    const minerTinyBody = [WORK, WORK, WORK]; // minerTiny with 3 WORK parts

    // Count our creeps by role
    const minerStarts = _.filter(
      Game.creeps,
      (creep) => creep.memory.role === "minerStart"
    );

    const heavyMiners = _.filter(
      Game.creeps,
      (creep) => creep.memory.role === "miner"
    );

    // Spawn logic - prioritize minerStart if we don't have one
    if (minerStarts.length < 1) {
      this.spawnMinerStart(spawner, minerStartBody);
    }
    // If we have a minerStart but no heavy miners, spawn one
    else if (heavyMiners.length < 1) {
      this.spawnHeavyMiner(spawner, minerTinyBody);
    }
  },

  spawnMinerStart: function (spawner, body) {
    // Generate a unique name for the miner
    const newName = "MinerStart" + Game.time;

    const sources = spawner.room.find(FIND_SOURCES);
    // Find the closest source to the spawner (prefer north if possible)
    let closestSource = this.findNorthernSource(spawner, sources);

    // Spawn the starter miner
    spawner.spawnCreep(body, newName, {
      memory: {
        role: "minerStart",
        working: false,
        sourceId: closestSource ? closestSource.id : null,
      },
      directions: [TOP], // North direction
    });
  },

  spawnHeavyMiner: function (spawner, body) {
    // Generate a unique name for the heavy miner
    const newName = "minerTiny" + Game.time;

    const sources = spawner.room.find(FIND_SOURCES);
    // Find a source to the northwest of spawner if possible
    let northwestSource = this.findNorthwestSource(spawner, sources);

    // Spawn the heavy miner
    spawner.spawnCreep(body, newName, {
      memory: {
        role: "miner",
        working: false,
        sourceId: northwestSource ? northwestSource.id : null,
      },
      directions: [TOP_LEFT], // Northwest direction
    });
  },

  findNorthernSource: function (spawner, sources) {
    if (sources.length === 0) return null;

    // First try to find a source north of the spawner
    const northSources = sources.filter(
      (source) => source.pos.y < spawner.pos.y
    );

    if (northSources.length > 0) {
      // Get the closest northern source
      return spawner.pos.findClosestByPath(northSources);
    } else {
      // If no northern sources, get any closest source
      return spawner.pos.findClosestByPath(sources);
    }
  },

  findNorthwestSource: function (spawner, sources) {
    if (sources.length === 0) return null;

    // Try to find a source northwest of the spawner
    const northwestSources = sources.filter(
      (source) => source.pos.y < spawner.pos.y && source.pos.x < spawner.pos.x
    );

    if (northwestSources.length > 0) {
      // Get the closest northwestern source
      return spawner.pos.findClosestByPath(northwestSources);
    } else {
      // If no northwestern sources, try just north sources first
      const northSources = sources.filter(
        (source) => source.pos.y < spawner.pos.y
      );

      if (northSources.length > 0) {
        return spawner.pos.findClosestByPath(northSources);
      } else {
        // If still no suitable source, pick one that's not already taken
        const availableSources = sources.filter(
          (source) =>
            !_.some(
              Game.creeps,
              (c) =>
                c.memory.sourceId === source.id &&
                c.memory.role === "minerStart"
            )
        );

        if (availableSources.length > 0) {
          return spawner.pos.findClosestByPath(availableSources);
        } else {
          // If all sources are taken, just pick any source
          return sources[0];
        }
      }
    }
  },
};
