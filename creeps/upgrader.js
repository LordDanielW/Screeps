//
//
//
var roleUpgrader = {
  /** @param {Creep} creep **/
  run: function (creep) {
    //creep.memory.task = "UPGRADE";
    if (
      (creep.memory.task == "UPGRADE" && creep.carry.energy == 0) ||
      creep.memory.task != "GET"
    ) {
      roleUtilities.sayState(creep, "GET", true);
      creep.memory.task = "GET";
    } else if (
      creep.memory.task == "GET" &&
      creep.carry.energy == creep.carryCapacity
    ) {
      creep.memory.task = "UPGRADE";
    }

    if (creep.memory.task == "UPGRADE") {
      roleUtilities.doUpgrade(creep);
    } else if (creep.memory.task == "GET") {
      let upSource = Game.getObjectById(
        Memory.TaskMan[creep.room.name].upgradeContainer
      );

      var iState = creep.withdraw(upSource, RESOURCE_ENERGY);
      if (iState == ERR_NOT_IN_RANGE) {
        creep.moveTo(upSource.pos, this.pathStyle);
        return true;
      } else if (iState == OK) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }

    // if (!roleUtilities.getEnergyLink(creep, 1)) {
    //   roleUtilities.getEnergyContainer(creep, 2);
    //   //roleUtilities.getEnergyHarvest(creep);
    // }

    //   if(creep.memory.source == 1){
    //     roleUtilities.getEnergyLink(creep, 1);
    //   } else{
    //     roleUtilities.getEnergyHarvest(creep);
    //   }
    // } else {
    //   creep.memory.task = "GET";
    // }
  },
};

module.exports.Upgrader = roleUpgrader;
