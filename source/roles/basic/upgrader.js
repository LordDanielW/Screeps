//
//
//
var roleUpgrader = {
  /** @param {Creep} creep **/
  run: function (creep) {
    // creep.upgradeController(creep.room.controller);
    // return;

    //creep.memory.task = "UPGRADE";
    creepTasks = ["GET", "UPGRADE", "MOVIN"];

    //  Check Task
    //
    if (
      (creep.memory.task == "UPGRADE" && creep.carry.energy == 0) ||
      !creepTasks.includes(creep.memory.task)
    ) {
      utils.action.sayState(creep, "GET", true);
      creep.memory.task = "GET";
    } else if (
      creep.memory.task == "GET" &&
      creep.carry.energy == creep.carryCapacity
    ) {
      creep.memory.task = "UPGRADE";
    }

    //  Do Task
    //
    if (creep.memory.task == "UPGRADE") {
      utils.action.doUpgrade(creep);
    } else if (creep.memory.task == "GET") {
      //  Get energy from container
      if (
        Memory.TaskMan[creep.room.name] &&
        Memory.TaskMan[creep.room.name].upgradeContainer
      ) {
        let upSource = Game.getObjectById(
          Memory.TaskMan[creep.room.name].upgradeContainer
        );

        var iState = creep.withdraw(upSource, RESOURCE_ENERGY);

        if (iState == ERR_NOT_IN_RANGE) {
          utils.action.moveTo(creep, upSource);
          return true;
        } else if (iState == OK) {
          return true;
        } else {
          return false;
        }
      } else {
        //  Pickup energy from ground
        utils.action.getResource(creep);
      }
    } else if (creep.memory.task == "MOVIN") {
      var mPOS = creep.memory.movePOS;
      var moveTO = new RoomPosition(mPOS.x, mPOS.y, mPOS.roomName);
      if (creep.pos.isEqualTo(moveTO)) {
        creep.memory.task = "GET";
      } else {
        utils.action.moveTo(creep, moveTO);
      }
    } else {
      return false;
    }
  },
};

module.exports.Upgrader = roleUpgrader;
