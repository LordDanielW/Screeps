var roleUtilities = require('role.Utilities');
var roleUpCarrier = {
  /** @param {Creep} creep **/
  run: function (creep) {

    if (creep.carry.energy == 0 && creep.memory.task != 'reap') {
      creep.memory.task = 'reap';
      creep.say('🔄 reap', true);
    } else if (creep.memory.task == 'reap' && creep.carry.energy == creep.carryCapacity) {
      creep.memory.task = 'sow';
      creep.say('🌻 sow', true);
    }
    if (creep.memory.task == 'reap') {
      roleUtilities.getEnergyStorage(creep);
    } else {
      var container = creep.room.find(FIND_STRUCTURES, { filter: (structure) => { return (structure.structureType == STRUCTURE_CONTAINER); } });
      if (container[1].store.energy < container[1].storeCapacity) {
        if (creep.transfer(container[1], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(container[1].pos, { visualizePathStyle: { stroke: '#ffffff' } });
        }
      } else {
        var targets = creep.room.find(FIND_STRUCTURES, {
          filter: (structure) => {
            return (structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
          }
        });
        if (targets.length > 0) {
          if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
          }
        } else {
          creep.say('🍦 Idle', true);
          creep.moveTo(Game.flags.Flag1.pos, { visualizePathStyle: { stroke: '#ffffff' } });
        }
      }
    }
  },
  build: [CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE]
};

module.exports = roleUpCarrier;