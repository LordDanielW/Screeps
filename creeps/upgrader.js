//
//
//
var roleUpgrader = {
  /** @param {Creep} creep **/
  run: function (creep) {
    //creep.memory.task = "UPGRADE";
    if (creep.memory.task == "UPGRADE" && creep.carry.energy == 0) {
      creep.memory.upgrading = false;
      creep.say("🔋", true);
    }
    if (
      creep.memory.task == "GET" &&
      creep.carry.energy == creep.carryCapacity
    ) {
      creep.memory.task = "UPGRADE";
    }

    if (creep.memory.task == "UPGRADE") {
      roleUtilities.doUpgrade(creep);
    } else if (creep.memory.task == "GET") {
      if (!roleUtilities.getEnergyLink(creep, 1)) {
        roleUtilities.getEnergyContainer(creep, 2);
        //roleUtilities.getEnergyHarvest(creep);
      }

      //   if(creep.memory.source == 1){
      //     roleUtilities.getEnergyLink(creep, 1);
      //   } else{
      //     roleUtilities.getEnergyHarvest(creep);
      //   }
    } else {
      creep.memory.task = "GET";
    }
  },
};

module.exports.Upgrader = roleUpgrader;
