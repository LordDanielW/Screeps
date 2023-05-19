//
//
var roleBreaker = {
  /** @param {Creep} creep **/
  run: function (creep) {
    // creep.memory.task = "BREAK";
    // creep.memory.roomPos = { x: 49, y: 12, roomName: "E9N54" };
    creep.memory.break = "6453dd062dcf1466c079d6d8";

    creepTasks = ["MOVIN", "BREAK", "SIT"];

    if (!creepTasks.includes(creep.memory.task)) {
      creep.memory.task = "MOVIN";
      return;
    }

    // MOVIN
    //
    if (creep.memory.task == "MOVIN") {
      let flagPOS = Game.flags[Memory.FlagName].pos;

      if (creep.pos.inRangeTo(flagPOS, 2)) {
        creep.memory.task = "SIT";
      } else {
        creep.heal(creep);
        utils.role.sayState(creep, "MOVE", true);
        creep.moveTo(flagPOS, { reusePath: 4 });
      }
    }
    //  BREAK
    //
    else if (creep.memory.task == "BREAK") {
      // Selected Destination from Memory
      let breakOBJ = Game.getObjectById(creep.memory.break);

      let response = creep.dismantle(breakOBJ);
      if (response == ERR_NOT_IN_RANGE) {
        creep.moveTo(breakOBJ);
      } else if (response == OK) {
        utils.role.sayState(creep, "BREAK", true);
      } else {
        utils.role.sayState(creep, "ERROR", true);
      }
    }
    // SIT
    //
    else if (creep.memory.task == "SIT") {
      // check Memory for next task
      if (Memory.grpTask1 != "SIT") {
        creep.memory.task = Memory.grpTask1;
        return;
      }
    }
  },
};

module.exports.Breaker = roleBreaker;
