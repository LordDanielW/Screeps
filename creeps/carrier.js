var roleCarrier = {
  /** @param {Creep} creep **/
  run: function (creep) {
    //  Variables
    let state = "NONE";

    // Check State Of Get / Give
    //
    if (creep.carry.energy == 0 && creep.memory.task == "Give") {
      creep.memory.task = "Get";
    } else if (
      creep.memory.task == "Get" &&
      creep.carry.energy == creep.carryCapacity
    ) {
      creep.memory.task = "Give";
      creep.say("🦑", true);
    } else if (creep.memory.task != "Get" && creep.memory.task != "Give") {
      creep.memory.task = "Get";
    }

    //  Get
    //
    if (creep.memory.task == "Get") {
      if (!roleUtilities.getEnergyContainer(creep, creep.memory.iStore)) {
        // roleUtilities.getEnergyFactory(creep);
        roleUtilities.getEnergyHarvest(creep);
      }
    }
    //  Give
    //
    else if (creep.memory.task == "Give") {
      // ** TODO : save path **
      // Keep previous target
      //let emptyStructure = creep.memory.emptyStructure;
      // If no target, get one
      //if (emptyStructure == null) {
      let emptyStructure = this.findEmpty(creep);
      //}

      // Move and transfer energy
      if (emptyStructure != null) {
        creep.memory.emptyStructure = emptyStructure;
        let response = creep.transfer(emptyStructure, RESOURCE_ENERGY);
        if (response == ERR_NOT_IN_RANGE) {
          creep.moveTo(emptyStructure, roleUtilities.pathStyle);
          state = "MOVE";
        } else if (response == OK) {
          state = "GIVE";
        } else {
          state = "ERROR";
        }
      } else {
        state = "IDLE";
      }

      // Report state
      roleUtilities.sayState(creep, state, true);
    }
  },
  findEmpty: function (creep) {
    let emptyStructure = [];
    // Check Spawners
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
          structure.energy < structure.energyCapacity
        );
      },
    });
    if (emptyStructure.length > 0) {
      return creep.pos.findClosestByPath(emptyStructure);
    }
    // Check Storage
    let containers = creep.room.find(FIND_STRUCTURES, {
      filter: (structure) => {
        return structure.structureType == STRUCTURE_CONTAINER;
      },
    });
    if (containers.length > 0 && containers[0].store.energy > 500) {
      emptyStructure = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
          return structure.structureType == STRUCTURE_STORAGE;
        },
      });
      if (emptyStructure.length > 0) {
        return emptyStructure[0];
      }
    }
    // Check upgrade Container
    if (containers.length >= 3 && containers[2].store.energy < 1500) {
      return containers[2];
    }
    //  Nothing to fill Return Empty
    return null;
  },
  body: [CARRY, CARRY, MOVE, CARRY, CARRY, MOVE], // CARRY, CARRY, MOVE],// CARRY, MOVE],
  build: function (creepMem) {
    var newName = "Carrier" + Memory.TaskMan.NameNum;
    Memory.TaskMan.NameNum++;
    return Game.spawns[creepMem.memory.spawn].spawnCreep(this.body, newName, {
      memory: { role: "Carrier", task: "Get" },
    });
  },
};

module.exports.Carrier = roleCarrier;
