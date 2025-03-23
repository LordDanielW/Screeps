module.exports = {
  run: function (creep) {
    // Check if we need to switch states
    if (creep.memory.building && creep.store[RESOURCE_ENERGY] === 0) {
      creep.memory.building = false;
      creep.memory.idle = true;
      delete creep.memory.targetId;
    }
    if (!creep.memory.building && creep.store[RESOURCE_ENERGY] > 0) {
      creep.memory.building = true;
      creep.memory.idle = false;
    }

    // If we're building
    if (creep.memory.building) {
      // If we don't have a target, find one
      if (!creep.memory.targetId) {
        const targets = creep.room.find(FIND_CONSTRUCTION_SITES);
        if (targets.length > 0) {
          // Sort by progress percentage to finish nearly-complete structures first
          targets.sort((a, b) => {
            const aPercent = a.progress / a.progressTotal;
            const bPercent = b.progress / b.progressTotal;
            return bPercent - aPercent;
          });

          creep.memory.targetId = targets[0].id;
        } else {
          // No construction sites, check for repairs
          const repairTargets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) =>
              structure.hits < structure.hitsMax && structure.hits < 10000, // Don't repair walls/ramparts too much
          });

          if (repairTargets.length > 0) {
            repairTargets.sort(
              (a, b) => a.hits / a.hitsMax - b.hits / b.hitsMax
            );
            creep.memory.targetId = repairTargets[0].id;
            creep.memory.repairing = true;
          } else {
            // Nothing to build or repair
            creep.memory.idle = true;
            return;
          }
        }
      }

      // Get the target
      const target = Game.getObjectById(creep.memory.targetId);
      if (!target) {
        // Target is gone
        delete creep.memory.targetId;
        delete creep.memory.repairing;
        return;
      }

      // Perform the action
      if (creep.memory.repairing) {
        if (creep.repair(target) === ERR_NOT_IN_RANGE) {
          creep.moveTo(target, { visualizePathStyle: { stroke: "#ff00ff" } });
        }
      } else {
        if (creep.build(target) === ERR_NOT_IN_RANGE) {
          creep.moveTo(target, { visualizePathStyle: { stroke: "#ff00ff" } });
        }
      }
    }
  },
};
