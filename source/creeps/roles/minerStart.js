// role.minerStart.js
module.exports = {
  run: function (creep) {
    // MinerStart stays in one place and mines, but transfers to spawner
    // If we don't have a sourceId, find one
    if (!creep.memory.sourceId) {
      const sources = creep.pos.findClosestByPath(FIND_SOURCES);
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

    const target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
    if (target) {
      if (creep.pickup(target) == ERR_NOT_IN_RANGE) {
        // Dont move
      }
    }

    // If we're full, transfer to spawner
    if (creep.store.getFreeCapacity() === 0) {
      const spawner = Game.spawns["Vat1"];

      // If not in range of spawner, move to it
      if (!creep.pos.inRangeTo(spawner, 1)) {
        creep.moveTo(spawner, { visualizePathStyle: { stroke: "#ffffff" } });
      } else {
        // Transfer energy to spawner
        creep.transfer(spawner, RESOURCE_ENERGY);
      }
      return;
    }

    // If we're not in range of the source, move to it
    if (!creep.pos.inRangeTo(source, 1)) {
      creep.moveTo(source, { visualizePathStyle: { stroke: "#ffaa00" } });
      return;
    }

    // If we're in range, harvest
    creep.memory.idle = false;
    creep.harvest(source);
  },
};
