// role.miner.js
module.exports = {
  run: function (creep) {
    // Miners stay in one place and mine
    // If we don't have a sourceId, find one
    if (!creep.memory.sourceId) {
      const sources = creep.room.find(FIND_SOURCES);
      if (sources.length > 0) {
        creep.memory.sourceId = sources[0].id;
      } else {
        return;
      }
    }

    // Get the source
    const source = Game.getObjectById(creep.memory.sourceId);
    if (!source) {
      // Source is gone somehow
      delete creep.memory.sourceId;
      return;
    }

    // If we're not in range, we need to be moved there
    if (!creep.pos.inRangeTo(source, 1)) {
      // If we have no MOVE parts, we need a mover to help us
      if (creep.getActiveBodyparts(MOVE) === 0) {
        creep.memory.idle = true;
        return;
      } else {
        // Move ourselves if we can
        creep.moveTo(source, { visualizePathStyle: { stroke: "#ffaa00" } });
        return;
      }
    }

    // If we're in range, harvest
    creep.memory.idle = false;
    creep.harvest(source);

    // If our container is full, drop energy
    if (creep.store.getFreeCapacity() === 0) {
      creep.drop(RESOURCE_ENERGY);
    }
  },
};
