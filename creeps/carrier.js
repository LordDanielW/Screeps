var roleCarrier = {
  /** @param {Creep} creep **/
  run: function (creep) {
    //  Variables

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
      // Fill Spawners
      var spawners = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
          return (
            (structure.structureType == STRUCTURE_EXTENSION ||
              structure.structureType == STRUCTURE_SPAWN) &&
            structure.energy < structure.energyCapacity
          );
        },
      });
      if (spawners.length > 0) {
        var spawn = creep.pos.findClosestByPath(spawners);
        if (creep.transfer(spawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(spawn, { visualizePathStyle: { stroke: "#ffffff" } });
        }
      }
      // Fill Towers
      else {
        var towers = creep.room.find(FIND_STRUCTURES, {
          filter: (structure) => {
            return (
              structure.structureType == STRUCTURE_TOWER &&
              structure.energy < structure.energyCapacity
            );
          },
        });
        if (towers.length > 0) {
          var tower = creep.pos.findClosestByPath(towers);
          if (creep.transfer(tower, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(tower, { visualizePathStyle: { stroke: "#ffffff" } });
          }
          // Fill Storage
        } else {
          var containers = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
              return structure.structureType == STRUCTURE_CONTAINER;
            },
          });
          if (containers.length > 0 && containers[0].store.energy > 500) {
            var storage = creep.room.find(FIND_STRUCTURES, {
              filter: (structure) => {
                return structure.structureType == STRUCTURE_STORAGE;
              },
            });
            if (
              creep.transfer(storage[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE
            ) {
              creep.moveTo(storage[0].pos, {
                visualizePathStyle: { stroke: "#ffffff" },
              });
            }
          }
        }
      }
    }
  },
  body: [CARRY, CARRY, MOVE], // CARRY, CARRY, MOVE, CARRY, CARRY, MOVE],// CARRY, MOVE],
  build: function (creepMem) {
    var newName = "Carrier" + Memory.TaskMan.NameNum;
    Memory.TaskMan.NameNum++;
    return Game.spawns[creepMem.memory.spawn].spawnCreep(this.body, newName, {
      memory: { role: "Carrier", task: "Get" },
    });
  },
};

module.exports.Carrier = roleCarrier;
