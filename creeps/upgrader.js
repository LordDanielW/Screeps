// var roleUtilities = require("role.Utilities");
var roleUpgrader = {
  /** @param {Creep} creep **/
  run: function (creep) {
    if (creep.memory.upgrading && creep.carry.energy == 0) {
      creep.memory.upgrading = false;
      creep.say("🔋", true);
    }
    if (!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
      creep.memory.upgrading = true;
    }

    if (creep.memory.upgrading) {
      roleUtilities.doUpgrade(creep);
    } else {
      if (!roleUtilities.getEnergyLink(creep, 1)) {
        //roleUtilities.getEnergyContainer(creep, 2);
        roleUtilities.getEnergyHarvest(creep);
      }

      //   if(creep.memory.source == 1){
      //     roleUtilities.getEnergyLink(creep, 1);
      //   } else{
      //     roleUtilities.getEnergyHarvest(creep);
      //   }
    }
  },
  body1: [
    WORK,
    WORK,
    WORK,
    WORK,
    WORK,
    WORK,
    WORK,
    WORK,
    WORK,
    WORK,
    MOVE,
    MOVE,
    CARRY,
    CARRY,
  ], //WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
  //WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
  body2: [WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE],
  body3: [WORK, CARRY, MOVE],
  build: function (creepMem) {
    var newName = "Upgrader" + Memory.TaskMan.NameNum;
    Memory.TaskMan.NameNum++;
    return Game.spawns[creepMem.memory.spawn].spawnCreep(
      this[creepMem.memory.body],
      newName,
      creepMem
    );
  },
};

module.exports.Upgrader = roleUpgrader;
