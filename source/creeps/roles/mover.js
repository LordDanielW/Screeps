module.exports = {
  run: function (creep) {
    // If the mover doesn't have a target, find one
    if (!creep.memory.targetId) {
      this.findImmobileCreepToMove(creep);
      return;
    }

    // Get the target creep
    const targetCreep = Game.getObjectById(creep.memory.targetId);
    if (!targetCreep) {
      // Target no longer exists
      delete creep.memory.targetId;
      delete creep.memory.destinationId;
      creep.memory.idle = true;
      return;
    }

    // If we have a target and destination
    if (creep.memory.destinationId) {
      const destination = Game.getObjectById(creep.memory.destinationId);
      if (!destination) {
        delete creep.memory.destinationId;
        return;
      }

      // If we're not at the destination yet, move there with the target
      if (!creep.pos.isNearTo(destination)) {
        creep.pull(targetCreep);
        creep.moveTo(destination, {
          visualizePathStyle: { stroke: "#ffaa00" },
        });
      } else {
        // We've reached the destination
        delete creep.memory.targetId;
        delete creep.memory.destinationId;
        creep.memory.idle = true;
      }
    } else {
      // Determine destination based on target's role
      this.assignDestination(creep, targetCreep);
    }
  },

  findImmobileCreepToMove: function (creep) {
    // Find creeps that need to be moved (miners, upgraders)
    const immobileCreeps = creep.room.find(FIND_MY_CREEPS, {
      filter: (c) => {
        // Check if creep has no MOVE parts
        const hasMoveParts = c.body.some((part) => part.type === MOVE);

        // Check if this is a newly spawned creep that needs placement
        const isNewlySpawned =
          c.pos.isNearTo(creep.room.find(FIND_MY_SPAWNS)[0]) &&
          (c.memory.role === "miner" || c.memory.role === "upgrade");

        // Check if the creep isn't already being moved by another mover
        const notBeingMoved = !_.some(
          Game.creeps,
          (mc) => mc.memory.role === "mover" && mc.memory.targetId === c.id
        );

        return !hasMoveParts && isNewlySpawned && notBeingMoved;
      },
    });

    if (immobileCreeps.length > 0) {
      creep.memory.targetId = immobileCreeps[0].id;
      creep.memory.idle = false;
    } else {
      creep.memory.idle = true;
    }
  },

  assignDestination: function (creep, targetCreep) {
    if (targetCreep.memory.role === "miner") {
      // Miners need to go to their source
      const sourceId = targetCreep.memory.sourceId;
      if (sourceId) {
        creep.memory.destinationId = sourceId;
      }
    } else if (targetCreep.memory.role === "upgrade") {
      // Upgraders need to go near the controller
      creep.memory.destinationId = creep.room.controller.id;
    }
  },
};
