module.exports = {
  run: function (creep) {
    // Implementation of the carry role
    // This creep has a source and a destination for energy

    // If we don't have a task, find one
    if (!creep.memory.hasTask) {
      this.findTask(creep);
      return;
    }

    // Determine if we're gathering or delivering
    if (
      !creep.memory.delivering &&
      creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0
    ) {
      // Switch to delivering mode
      creep.memory.delivering = true;
    }
    if (creep.memory.delivering && creep.store[RESOURCE_ENERGY] === 0) {
      // Switch to gathering mode
      creep.memory.delivering = false;
      // Clear current task
      creep.memory.hasTask = false;
      creep.memory.sourceId = null;
      creep.memory.targetId = null;
      return;
    }

    if (creep.memory.delivering) {
      // Deliver energy to the target
      const target = Game.getObjectById(creep.memory.targetId);
      if (!target) {
        // Target no longer exists
        creep.memory.hasTask = false;
        creep.memory.delivering = false;
        return;
      }

      if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.moveTo(target, { visualizePathStyle: { stroke: "#ffffff" } });
      }
    } else {
      // Gather energy from the source
      const source = Game.getObjectById(creep.memory.sourceId);
      if (!source) {
        // Source no longer exists
        creep.memory.hasTask = false;
        return;
      }

      // If it's a container/storage/dropped resource
      if (source.store) {
        if (creep.withdraw(source, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
          creep.moveTo(source, { visualizePathStyle: { stroke: "#ffaa00" } });
        }
      } else if (source.amount) {
        // It's a dropped resource
        if (creep.pickup(source) === ERR_NOT_IN_RANGE) {
          creep.moveTo(source, { visualizePathStyle: { stroke: "#ffaa00" } });
        }
      } else {
        // It must be a source or something we can't gather from
        console.log(`Carrier ${creep.name} assigned invalid source: ${source}`);
        creep.memory.hasTask = false;
      }
    }
  },

  findTask: function (creep) {
    // Sources to gather from (in priority order):
    // 1. Containers near sources
    // 2. Dropped resources

    // Energy destinations (in priority order):
    // 1. Spawn/Extensions that need energy
    // 2. Upgraders that need energy
    // 3. Builders that need energy
    // 4. Storage (if available)

    // First, find a source
    const containers = creep.room.find(FIND_STRUCTURES, {
      filter: (s) =>
        s.structureType === STRUCTURE_CONTAINER &&
        s.store[RESOURCE_ENERGY] > creep.store.getCapacity(),
    });

    if (containers.length > 0) {
      creep.memory.sourceId = containers[0].id;
    } else {
      // Look for dropped resources
      const droppedEnergy = creep.room.find(FIND_DROPPED_RESOURCES, {
        filter: (r) => r.resourceType === RESOURCE_ENERGY && r.amount > 50,
      });

      if (droppedEnergy.length > 0) {
        creep.memory.sourceId = droppedEnergy[0].id;
      } else {
        // No good energy sources found
        creep.memory.idle = true;
        return;
      }
    }

    // Now find a destination
    // First, look for spawn/extensions that need energy
    const energyNeedy = creep.room.find(FIND_STRUCTURES, {
      filter: (s) =>
        (s.structureType === STRUCTURE_SPAWN ||
          s.structureType === STRUCTURE_EXTENSION) &&
        s.store.getFreeCapacity(RESOURCE_ENERGY) > 0,
    });

    if (energyNeedy.length > 0) {
      creep.memory.targetId = energyNeedy[0].id;
      creep.memory.hasTask = true;
      creep.memory.delivering = false;
      creep.memory.idle = false;
      return;
    }

    // Next, look for upgraders that need energy
    const upgraders = _.filter(
      Game.creeps,
      (c) =>
        c.memory.role === "upgrade" &&
        c.store.getFreeCapacity(RESOURCE_ENERGY) > 0 &&
        c.room.name === creep.room.name
    );

    if (upgraders.length > 0) {
      creep.memory.targetId = upgraders[0].id;
      creep.memory.hasTask = true;
      creep.memory.delivering = false;
      creep.memory.idle = false;
      return;
    }

    // Next, look for builders that need energy
    const builders = _.filter(
      Game.creeps,
      (c) =>
        c.memory.role === "build" &&
        c.store.getFreeCapacity(RESOURCE_ENERGY) > 0 &&
        c.room.name === creep.room.name
    );

    if (builders.length > 0) {
      creep.memory.targetId = builders[0].id;
      creep.memory.hasTask = true;
      creep.memory.delivering = false;
      creep.memory.idle = false;
      return;
    }

    // If we have storage, use that as a default destination
    const storages = creep.room.find(FIND_STRUCTURES, {
      filter: (s) => s.structureType === STRUCTURE_STORAGE,
    });

    if (storages.length > 0) {
      creep.memory.targetId = storages[0].id;
      creep.memory.hasTask = true;
      creep.memory.delivering = false;
      creep.memory.idle = false;
      return;
    }

    // If we found a source but no destination, mark as idle
    creep.memory.idle = true;
  },
};
