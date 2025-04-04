//
var roleCarrier = {
  /** @param {Creep} creep **/
  run: function (creep) {
    //  Variables
    let state = "NONE";

    // Check State Of Get / Give
    //

    creepTasks = ["MOVIN", "GET", "GIVE"];

    if (!creepTasks.includes(creep.memory.task)) {
      creep.memory.task = "GET";
      return;
    }

    if (creep.store.getUsedCapacity() == 0 && creep.memory.task == "GIVE") {
      utils.action.getResource(creep);
    }
    //
    else if (creep.memory.task == "GET" && creep.store.getFreeCapacity() == 0) {
      this.findEmptyStructure(creep);
    }

    //  Get
    //
    if (creep.memory.task == "GET") {
      utils.action.getResource(creep);
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
        // move to 1 distance of the structure
        if (creep.pos.getRangeTo(emptyStructure) > 0) {
          utils.action.moveTo(creep, emptyStructure);
        }

        let response = creep.transfer(emptyStructure, RESOURCE_ENERGY);
        if (response == ERR_NOT_IN_RANGE) {
          utils.action.moveTo(creep, emptyStructure);
          state = "MOVE";
        } else if (response == OK) {
          creep.memory.destination = null;

          state = "GIVE";
        } else if (response == ERR_NOT_ENOUGH_RESOURCES) {
          // find what resource the creep is carrying and transfer it
          let resourceType = Object.keys(creep.store)[0];
          response = creep.transfer(emptyStructure, resourceType);
          // response = creep.transfer(emptyStructure, RESOURCE_OXYGEN);
        } else {
          state = "ERROR";
          this.findEmptyStructure(creep);
        }
      } else {
        state = "ERROR";
        this.findEmptyStructure(creep);
      }

      // Report state
      utils.action.sayState(creep, state, true);
    } else {
      utils.action.getResource(creep);
    }
  },

  //  Find Empty Structure
  //
  findEmptyStructure: function (creep) {
    creep.memory.task = "GIVE";
    creep.memory.source = null;
    if (creep.store[RESOURCE_ENERGY] != 0) {
      let emptyStructure = undefined;

      // Check Spawner Extensions
      emptyStructure = creep.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (structure) => {
          return (
            (structure.structureType == STRUCTURE_EXTENSION ||
              structure.structureType == STRUCTURE_SPAWN) &&
            structure.energy < structure.energyCapacity
          );
        },
      });
      if (emptyStructure) {
        creep.memory.destination = emptyStructure.id;
        return true;
      }

      // Check Upgrade Container
      const roomName = creep.room.name;
      let upgradeContainerId = null;
      if (
        Memory.TaskMan &&
        Memory.TaskMan[roomName] &&
        Memory.TaskMan[roomName].upgradeContainer
      ) {
        upgradeContainerId = Memory.TaskMan[roomName].upgradeContainer;
      }

      let upgradeContainer = null;
      if (upgradeContainerId) {
        upgradeContainer = Game.getObjectById(upgradeContainerId);
      }

      // // Check Upgrade Container
      // if (
      //   upgradeContainer &&
      //   upgradeContainer.store.getFreeCapacity(RESOURCE_ENERGY) > 0
      // ) {
      //   creep.memory.destination = upgradeContainer.id;
      //   return true;
      // }

      // Check Towers
      emptyStructure = creep.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (structure) => {
          return (
            structure.structureType == STRUCTURE_TOWER &&
            structure.store.getUsedCapacity(RESOURCE_ENERGY) <
              structure.store.getCapacity(RESOURCE_ENERGY)
          );
        },
      });
      if (emptyStructure) {
        creep.memory.destination = emptyStructure.id;
        return true;
      }

      // Return The Terminal
      if (
        creep.room.terminal &&
        creep.room.terminal.store[RESOURCE_ENERGY] < 50000 &&
        creep.room.terminal.store.getFreeCapacity() >
          creep.store.getUsedCapacity()
      ) {
        creep.memory.destination = creep.room.terminal.id;
        return true;
      }

      // Return The Storage
      if (creep.room.storage) {
        creep.memory.destination = creep.room.storage.id;
        return true;
      } else {
        return false;
      }
    } else {
      // Return The Terminal
      if (creep.room.terminal) {
        creep.memory.destination = creep.room.terminal.id;
        return true;
      } else {
        return false;
      }
    }
  },
};

module.exports.Carrier = roleCarrier;
