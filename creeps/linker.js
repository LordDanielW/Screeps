//
//
//
var roleLinker = {
  // { role: "Linker", run: 2, atDest: false, body: "body2", sitPOS: { x: 26, y: 21, roomName: "E46N33" }, spawn: "Vat1", task:"reap"} }
  /** @param {Creep} creep **/
  run: function (creep) {
    //  creep.memory.run = 1;
    if (creep.memory.run == 1) {
      this.run1(creep);
    } else if (creep.memory.run == 2) {
      this.run2(creep);
    } else if (creep.memory.run == 3) {
      this.run3(creep);
    }
  },
  build: function (creepMem) {
    var newName = "Linker" + Memory.TaskMan.NameNum;
    Memory.TaskMan.NameNum++;
    return Game.spawns[creepMem.memory.spawn].spawnCreep(
      this[creepMem.memory.body],
      newName,
      creepMem
    );
  },
  body1: [CARRY, MOVE, CARRY, MOVE, CARRY, MOVE], // CARRY, MOVE, CARRY, MOVE, CARRY, MOVE],
  //   build1: function (creepMem) {
  //     var newName = 'Linker' + Memory.TaskMan.NameNum;
  //     Memory.TaskMan.NameNum++;
  //     return Game.spawns[creepMem.memory.spawn].spawnCreep(this.body, newName, { memory: { role: 'Linker', task: 'reap', run: 1 } });
  //   },
  run1: function (creep) {
    if (creep.carry.energy == 0) {
      var containers = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
          return structure.structureType == STRUCTURE_CONTAINER;
        },
      });
      if (
        creep.withdraw(containers[creep.memory.iStore], RESOURCE_ENERGY) ==
        ERR_NOT_IN_RANGE
      ) {
        creep.moveTo(containers[creep.memory.iStore], {
          visualizePathStyle: { stroke: "#00cc00" },
        });
      }
    } else {
      var containers = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
          return structure.structureType == STRUCTURE_CONTAINER;
        },
      });
      if (creep.transfer(containers[2], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(containers[2], {
          visualizePathStyle: { stroke: "#ffffff" },
        });
      }

      //   var towers = creep.room.find(FIND_STRUCTURES, {
      //     filter: (structure) => {
      //       return structure.structureType == STRUCTURE_TOWER && structure.energy < (structure.energyCapacity - 300);
      //     }
      //   });
      //   if (towers.length > 0) {
      //      var tower = creep.pos.findClosestByPath(towers);
      //      if (creep.transfer(tower, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
      //       creep.moveTo(tower, { visualizePathStyle: { stroke: '#ffffff' } });
      //      }
      //   } else {
      //         var containers = creep.room.find(FIND_STRUCTURES, { filter: (structure) => { return (structure.structureType == STRUCTURE_CONTAINER); } });
      //         if (creep.transfer(containers[2], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
      //           creep.moveTo(containers[2], { visualizePathStyle: { stroke: '#ffffff' } });
      //         }
      //   }
    }
  },
  run2: function (creep) {
    if (creep.memory.atDest) {
      if (creep.carry.energy == 0) {
        var iSource = Game.getObjectById(creep.memory.iSource);
        if (iSource.store[RESOURCE_ENERGY] > 400) {
          creep.withdraw(iSource, RESOURCE_ENERGY);
        }
      } else {
        var iDest = Game.getObjectById(creep.memory.iDest);
        creep.transfer(iDest, RESOURCE_ENERGY);
      }
    } else {
      var mPOS = creep.memory.sitPOS;
      var sitPOS = new RoomPosition(mPOS.x, mPOS.y, mPOS.roomName);
      if (creep.pos.isEqualTo(sitPOS)) {
        var SourceID = creep.pos.findClosestByRange(FIND_STRUCTURES, {
          filter: (structure) => {
            return structure.structureType == STRUCTURE_CONTAINER;
          },
        });
        var DestID = creep.pos.findClosestByRange(FIND_STRUCTURES, {
          filter: (structure) => {
            return structure.structureType == STRUCTURE_LINK;
          },
        });
        if (SourceID) {
          creep.memory.atDest = true;
          creep.memory.iSource = SourceID.id;
          creep.memory.iDest = DestID.id;
        }
      } else {
        creep.moveTo(sitPOS, { visualizePathStyle: { stroke: "#ffaa00" } });
      }
    }
  },
  body2: [CARRY, MOVE], // CARRY],
  //   build2: function (creepMem) {
  //     var newName = 'Linker' + Memory.TaskMan.NameNum;
  //     Memory.TaskMan.NameNum++;
  //     return Game.spawns[creepMem.memory.spawn].spawnCreep(this.body2, newName, { memory: { role: 'Linker', task: 'reap', run: 2 } });
  //   },
  run3: function (creep) {
    // sowPOS = new RoomPosition(17, 8, "W17N38");
    // reapPOS = new RoomPosition(2, 16, "W16N38");

    var sPOS = creep.memory.givePOS;
    var sowPOS = new RoomPosition(sPOS.x, sPOS.y, sPOS.roomName);
    var mPOS = creep.memory.getPOS;
    var reapPOS = new RoomPosition(mPOS.x, mPOS.y, mPOS.roomName);
    var closestHostile = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if (closestHostile) {
      creep.memory.task = "sow";
      creep.say("🌻 sow", true);
    } else if (creep.carry.energy == 0 && creep.memory.task == "sow") {
      creep.memory.task = "reap";
      creep.say("🔄 reap", true);
    } else if (
      creep.memory.task == "reap" &&
      creep.carry.energy == creep.carryCapacity
    ) {
      creep.memory.task = "sow";
      creep.say("🌻 sow", true);
    }

    if (creep.memory.task == "sow") {
      if (creep.room.name == sowPOS.roomName) {
        var storage = creep.room.find(FIND_STRUCTURES, {
          filter: (structure) => {
            return structure.structureType == STRUCTURE_STORAGE;
          },
        });
        if (creep.transfer(storage[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(sowPOS, { visualizePathStyle: { stroke: "#ffaa00" } });
        }
      } else {
        creep.moveTo(sowPOS, { visualizePathStyle: { stroke: "#ffaa00" } });
      }
      var repairTarg = creep.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (structure) => {
          return (
            structure.structureType == STRUCTURE_ROAD &&
            structure.hits < structure.hitsMax
          );
        },
      });
      if (repairTarg) {
        creep.repair(repairTarg);
      }
    } else {
      // Reap
      if (creep.room.name == reapPOS.roomName) {
        roleUtilities.getEnergyHarvest(creep);
      } else {
        creep.moveTo(reapPOS, { visualizePathStyle: { stroke: "#ffaa00" } });
      }
    }
  },
  body: [],
};

module.exports.Linker = roleLinker;
