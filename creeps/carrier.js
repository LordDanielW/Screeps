//
//
//
var roleCarrier = {
  /** @param {Creep} creep **/
  run: function (creep) {
    //  Variables
    let state = "NONE";

    // Check State Of Get / Give
    //
    if (
      (creep.store.getUsedCapacity() == 0 && creep.memory.task == "GIVE") ||
      (creep.memory.task != "GET" && creep.memory.task != "GIVE")
    ) {
      this.findFullSource(creep);
    }
    //
    else if (creep.memory.task == "GET" && creep.store.getFreeCapacity() == 0) {
      this.findEmptyStructure(creep);
    }

    //  Get
    //
    if (creep.memory.task == "GET") {
      // Selected Destination from Memory
      let fullSource = Game.getObjectById(creep.memory.source);

      // Move and transfer energy
      if (fullSource != null) {
        let response;
        if (creep.memory.sourceType == "DROPPED_RESOURCES") {
          response = creep.pickup(fullSource);
        } else {
          response = creep.withdraw(fullSource, RESOURCE_ENERGY);
        }
        if (response == ERR_NOT_IN_RANGE) {
          creep.moveTo(fullSource, roleUtilities.pathStyle);
          state = "MOVE";
        } else if (response == OK) {
          state = "GET";
        } else {
          if (this.findFullSource(creep)) {
            state = "ERROR";
          }
        }
      } else {
        if (!this.findFullSource(creep)) {
          state = "ERROR";
        }
      }

      // Report state
      roleUtilities.sayState(creep, state, true);
    }
    //  Give
    //
    else if (creep.memory.task == "GIVE") {
      // Selected Destination from Memory
      let emptyStructure = Game.getObjectById(creep.memory.destination);

      if (emptyStructure == null) {
        this.findEmptyStructure(creep);
        emptyStructure = Game.getObjectById(creep.memory.destination);
      }

      // Move and transfer energy
      if (emptyStructure != null) {
        let response = creep.transfer(emptyStructure, RESOURCE_ENERGY);
        if (response == ERR_NOT_IN_RANGE) {
          creep.moveTo(emptyStructure, roleUtilities.pathStyle);
          state = "MOVE";
        } else if (response == OK) {
          creep.memory.destination = null;

          state = "GIVE";
        } else if (response == ERR_NOT_ENOUGH_RESOURCES) {
          response = creep.transfer(emptyStructure, RESOURCE_OXYGEN);
        } else {
          state = "ERROR";
          this.findEmptyStructure(creep);
        }
      } else {
        state = "ERROR";
        this.findEmptyStructure(creep);
      }

      // Report state
      roleUtilities.sayState(creep, state, true);
    } else {
      this.findFullSource(creep);
    }
  },

  //  Find Full Source
  //
  findFullSource: function (creep) {
    creep.memory.task = "GET";

    let fullSource = [];
    // Check Tombstones
    fullSource = creep.room.find(FIND_TOMBSTONES, {
      filter: (tomb) => {
        return tomb.creep.store >= creep.carryCapacity;
      },
    });
    if (fullSource.length > 0) {
      creep.memory.source = creep.pos.findClosestByPath(fullSource).id;
      creep.memory.sourceType = "TOMBSTONES";
      return true;
    }
    // Check Dropped
    fullSource = creep.room.find(FIND_DROPPED_RESOURCES, {
      filter: (dropped) => {
        return dropped.amount >= creep.carryCapacity;
      },
    });
    if (fullSource.length > 0) {
      creep.memory.source = creep.pos.findClosestByPath(fullSource).id;
      creep.memory.sourceType = "DROPPED_RESOURCES";
      return true;
    }
    // Check Room Sources
    let roomSources = Memory.TaskMan[creep.room.name].sourceContainers;
    for (let i = 0; i < roomSources.length; i++) {
      let sourceContainer = Game.getObjectById(roomSources[i]);
      if (sourceContainer.store[RESOURCE_ENERGY] >= creep.carryCapacity) {
        creep.memory.source = sourceContainer.id;
        creep.memory.sourceType = "SOURCES";
        return true;
      }
    }
    //
    if (fullSource.length > 0) {
      creep.memory.task = "IDLE";
      return false;
    }
  },

  //  Find Empty Structure
  //
  findEmptyStructure: function (creep) {
    creep.memory.task = "GIVE";
    if (creep.store[RESOURCE_ENERGY] != 0) {
      let emptyStructure = [];
      // Check Spawner Extensions
      emptyStructure = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
          return (
            (structure.structureType == STRUCTURE_EXTENSION ||
              structure.structureType == STRUCTURE_SPAWN) &&
            structure.energy < structure.energyCapacity
          );
        },
      });
      if (emptyStructure.length > 0) {
        creep.memory.destination =
          creep.pos.findClosestByPath(emptyStructure).id;
        return true;
      }
      // Check Towers
      emptyStructure = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
          return (
            structure.structureType == STRUCTURE_TOWER &&
            structure.store.getUsedCapacity(RESOURCE_ENERGY) <
              structure.store.getCapacity(RESOURCE_ENERGY)
          );
        },
      });
      if (emptyStructure.length > 0) {
        creep.memory.destination =
          creep.pos.findClosestByPath(emptyStructure).id;
        return true;
      }
      // Return The Storage
      emptyStructure = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
          return structure.structureType == STRUCTURE_STORAGE;
        },
      });
      if (emptyStructure.length > 0) {
        creep.memory.destination = emptyStructure[0].id;
        return true;
      } else {
        return false;
      }
    } else {
      // Return The Storage
      emptyStructure = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
          return structure.structureType == STRUCTURE_STORAGE;
        },
      });
      if (emptyStructure.length > 0) {
        creep.memory.destination = emptyStructure[0].id;
        return true;
      } else {
        return false;
      }
    }
  },
};

module.exports.Carrier = roleCarrier;
