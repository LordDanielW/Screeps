//
//
var roleBreaker = {
  /** @param {Creep} creep **/
  run: function (creep) {
    // creep.memory.task = "BREAK";
    // creep.memory.roomPos = { x: 49, y: 12, roomName: "E9N54" };
    // creep.memory.break = "645726bebc2f4b95ec1a04f1";

    creepTasks = ["MOVIN", "BREAK", "SIT"];

    if (!creepTasks.includes(creep.memory.task)) {
      utilities.roleUtilities.sayState(creep, "IDLE", true);
      return;
    }

    // MOVIN
    //
    if (creep.memory.task == "MOVIN") {
      let flagPOS = Game.flags[Memory.FlagName].pos;

      if (creep.pos.inRangeTo(flagPOS, 6)) {
        creep.memory.task = "SIT";
      } else {
        utilities.roleUtilities.sayState(creep, "MOVE", true);
        creep.moveTo(flagPOS, (reusePath = 25));
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
        utilities.roleUtilities.sayState(creep, "BREAK", true);
      } else {
        utilities.roleUtilities.sayState(creep, "ERROR", true);
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