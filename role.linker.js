var roleUtilities = require('role.Utilities');
var roleLinker = {
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
    var newName = 'Linker' + Memory.TaskMan.NameNum;
    Memory.TaskMan.NameNum++;
    return Game.spawns[creepMem.memory.spawn].spawnCreep(this[creepMem.memory.body], newName, creepMem);
  },
  body1: [CARRY, MOVE],
  build1: function (creepMem) {
    var newName = 'Linker' + Memory.TaskMan.NameNum;
    Memory.TaskMan.NameNum++;
    return Game.spawns[creepMem.memory.spawn].spawnCreep(this.body, newName, { memory: { role: 'Linker', task: 'reap', run: 1 } });
  },
  run1: function (creep) {
    if (creep.carry.energy == 0) {
      var containers = creep.room.find(FIND_STRUCTURES, { filter: (structure) => { return (structure.structureType == STRUCTURE_CONTAINER); } });
      if (containers[0].store.energy > 200) {
        if (creep.withdraw(containers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(containers[0], { visualizePathStyle: { stroke: '#00cc00' } });
        }
        // } else {
        //   roleUtilities.getEnergyStorage(creep);
      }
    } else {
      var towers = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
          return structure.structureType == STRUCTURE_TOWER && structure.energy < (structure.energyCapacity - 300);
        }
      });
      // if (towers.length > 0) {
      //   var tower = creep.pos.findClosestByPath(towers);
      //   if (creep.transfer(tower, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
      //     creep.moveTo(tower, { visualizePathStyle: { stroke: '#ffffff' } });
      //   }
      // } else {
      var linkers = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => { return (structure.structureType == STRUCTURE_LINK); }
      });
      if (linkers.length > 0 && linkers[0].energy < linkers[0].energyCapacity) {
        if (creep.transfer(linkers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(linkers[0], { visualizePathStyle: { stroke: '#ffffff' } });
        }
      }
      //    }
    }
  },
  run2: function (creep) {
    var reapPOS = new RoomPosition(33, 33, "W16N39");
    var sowPOS = new RoomPosition(17, 8, "W17N38");
    var closestHostile = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if (closestHostile) {
      creep.memory.task = 'sow';
      creep.say('🌻 sow', true);
    } else if (_.sum(creep.carry) == 0 && creep.memory.task == 'sow') {
      creep.memory.task = 'reap';
      creep.say('🔄 reap', true);
    } else if (creep.memory.task == 'reap' && _.sum(creep.carry) == creep.carryCapacity) {
      creep.memory.task = 'sow';
      creep.say('🌻 sow', true);
    }

    if (creep.memory.task == 'sow') {
      if (creep.room.name == sowPOS.roomName) {//.pos.isEqualTo(sowPOS)) {
        var storage = Game.rooms.W17N38.storage
        if (creep.transfer(storage, "LHO2") == ERR_NOT_IN_RANGE) {
          creep.moveTo(storage, { visualizePathStyle: { stroke: '#ffaa00' } });
        }
      } else {
        creep.moveTo(sowPOS, { visualizePathStyle: { stroke: '#ffaa00' } });
      }
    } else { // creep.memory.task == 'reap'
      //creep.say("here!");
      if (creep.room.name == reapPOS.roomName) {//}.pos.isEqualTo(reapPOS)) {
        //_.sum(Game.rooms.W16N39.storage.store);
        //var resource = Game.rooms.W16N39.storage.store[0];
        if (creep.withdraw(Game.rooms.W16N39.storage, "UH2O") == ERR_NOT_IN_RANGE) {
          creep.moveTo(reapPOS, { visualizePathStyle: { stroke: '#ffaa00' } });
        }
      } else {
        creep.moveTo(reapPOS, { visualizePathStyle: { stroke: '#ffaa00' } });
      }
    }
  },
  body2: [CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE],
  build2: function (creepMem) {
    var newName = 'Linker' + Memory.TaskMan.NameNum;
    Memory.TaskMan.NameNum++;
    return Game.spawns[creepMem.memory.spawn].spawnCreep(this.body2, newName, { memory: { role: 'Linker', task: 'reap', run: 2 } });
  },
  run3: function (creep) {
    // sowPOS = new RoomPosition(17, 8, "W17N38");
    // reapPOS = new RoomPosition(2, 16, "W16N38");

    var sPOS = creep.memory.givePOS;
    var sowPOS = new RoomPosition(sPOS.x, sPOS.y, sPOS.roomName);
    var mPOS = creep.memory.getPOS;
    var reapPOS = new RoomPosition(mPOS.x, mPOS.y, mPOS.roomName);
    var closestHostile = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if (closestHostile) {
      creep.memory.task = 'sow';
      creep.say('🌻 sow', true);
    } else if (creep.carry.energy == 0 && creep.memory.task == 'sow') {
      creep.memory.task = 'reap';
      creep.say('🔄 reap', true);
    } else if (creep.memory.task == 'reap' && creep.carry.energy == creep.carryCapacity) {
      creep.memory.task = 'sow';
      creep.say('🌻 sow', true);
    }

    if (creep.memory.task == 'sow') {
      if (creep.room.name == sowPOS.roomName) {
        var storage = creep.room.find(FIND_STRUCTURES, { filter: (structure) => { return (structure.structureType == STRUCTURE_STORAGE); } });
        if (creep.transfer(storage[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(sowPOS, { visualizePathStyle: { stroke: '#ffaa00' } });
        }
      } else {
        creep.moveTo(sowPOS, { visualizePathStyle: { stroke: '#ffaa00' } });
      }
      var repairTarg = creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: (structure) => { return structure.structureType == STRUCTURE_ROAD && structure.hits < structure.hitsMax } });
      if (repairTarg) { creep.repair(repairTarg); }
    } else { // Reap
      if (creep.room.name == reapPOS.roomName) {
        roleUtilities.getEnergyHarvest(creep);
      } else {
        creep.moveTo(reapPOS, { visualizePathStyle: { stroke: '#ffaa00' } });
      }
    }
  },
  body3: [WORK, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE],
  build3: function (creepMem) {
    var newName = 'Linker' + Memory.TaskMan.NameNum;
    Memory.TaskMan.NameNum++;
    return Game.spawns[creepMem.memory.spawn].spawnCreep(this[creepMem.memory.body], newName, creepMem);
  }
};

module.exports = roleLinker;