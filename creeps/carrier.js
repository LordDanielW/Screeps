//
//
//
var roleCarrier = {
  /** @param {Creep} creep **/
  run1: function (creep) {},
  run: function (creep) {
    //  Variables
    let state = "NONE";

    // Check State Of Get / Give
    //
    if (
      (creep.carry.energy == 0 && creep.memory.task == "GIVE") ||
      (creep.memory.task != "GET" && creep.memory.task != "GIVE")
    ) {
      creep.memory.task = "GET";
      this.findFullSource(creep);
    }
    //
    else if (
      creep.memory.task == "GET" &&
      creep.carry.energy == creep.carryCapacity
    ) {
      creep.memory.task = "GIVE";
      creep.memory.destination = this.findEmptyStructure(creep).id;
    }

    //  Get
    //
    if (creep.memory.task == "GET") {
      // Selected Destination from Memory
      let fullSource = Game.getObjectById(creep.memory.source);

      // Move and transfer energy
      if (fullSource != null) {
        let response = creep.withdraw(fullSource, RESOURCE_ENERGY);
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

      // Move and transfer energy
      if (emptyStructure != null) {
        let response = creep.transfer(emptyStructure, RESOURCE_ENERGY);
        if (response == ERR_NOT_IN_RANGE) {
          creep.moveTo(emptyStructure, roleUtilities.pathStyle);
          state = "MOVE";
        } else if (response == OK) {
          state = "GIVE";
        } else {
          state = "ERROR";
          creep.memory.destination = this.findEmptyStructure(creep).id;
        }
      } else {
        state = "ERROR";
        creep.memory.destination = this.findEmptyStructure(creep).id;
      }

      // Report state
      roleUtilities.sayState(creep, state, true);
    } else {
      creep.memory.task = "GET";
    }
  },

  //  Find Full Source
  //
  findFullSource: function (creep) {
    let fullSource = [];
    // Check Tombstones
    fullSource = creep.room.find(FIND_TOMBSTONES, {
      filter: (tomb) => {
        return tomb.creep.store >= creep.carryCapacity;
      },
    });
    if (fullSource.length > 0) {
      creep.memory.source = creep.pos.findClosestByPath(fullSource).id;
      return true;
    }
    // Check Dropped
    // console.log("here2");
    // fullSource = creep.room.find(FIND_DROPPED_RESOURCES, {
    //   filter: (dropped) => {
    //     return dropped.creep.store >= creep.carryCapacity;
    //   },
    // });
    // if (fullSource.length > 0) {
    //   creep.memory.source = creep.pos.findClosestByPath(fullSource).id;
    //   return true;
    // }
    // Check Room Sources
    let roomSources = Memory.TaskMan[creep.room.name].sources;
    for (let i = 0; i < roomSources.length; i++) {
      let sourceContainer = Game.getObjectById(roomSources[i]);
      if (sourceContainer.store[RESOURCE_ENERGY] >= creep.carryCapacity) {
        creep.memory.source = sourceContainer.id;
        return true;
        fullSource.push(sourceContainer);
      }
    }
    //
    if (fullSource.length > 0) {
      creep.memory.task = "IDLE";
      return false;
      //return creep.pos.findClosestByPath(fullSource);
    }
  },

  //  Find Empty Structure
  //
  findEmptyStructure: function (creep) {
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
      return creep.pos.findClosestByPath(emptyStructure);
    }
    // Check Towers
    emptyStructure = creep.room.find(FIND_STRUCTURES, {
      filter: (structure) => {
        return (
          structure.structureType == STRUCTURE_TOWER &&
          structure.store.getUsedCapacity < structure.store.getCapacity
        );
      },
    });
    if (emptyStructure.length > 0) {
      return creep.pos.findClosestByPath(emptyStructure);
    }
    // Return The Storage
    return creep.room.find(FIND_STRUCTURES, {
      filter: (structure) => {
        return structure.structureType == STRUCTURE_STORAGE;
      },
    })[0];
  },
};

module.exports.Carrier = roleCarrier;
