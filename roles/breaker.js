//
//
var roleBreaker = {
  /** @param {Creep} creep **/
  run: function (creep) {
    // creep.memory.task = "BREAK";
    // creep.memory.roomPos = { x: 48, y: 25, roomName: "E9N54" };
    creep.memory.break = "6453dd062dcf1466c079d6d8";

    if (creep.memory.task != "MOVIN" && creep.memory.task != "BREAK") {
      utilities.roleUtilities.sayState(creep, "IDLE", true);
      return;
    }

    // Selected Destination from Memory
    let breakOBJ = Game.getObjectById(creep.memory.break);

    let breakPos = new RoomPosition(
      creep.memory.roomPos.x,
      creep.memory.roomPos.y,
      creep.memory.roomPos.roomName
    );

    if (creep.memory.task == "MOVIN") {
      if (creep.pos.inRangeTo(breakPos, 1)) {
        creep.memory.task = "BREAK";
        utilities.roleUtilities.sayState(creep, "BREAK", true);
        this.run(creep);
      } else {
        utilities.roleUtilities.sayState(creep, "MOVE", true);
        creep.moveTo(breakPos, {
          visualizePathStyle: { stroke: "#ffaa00" },
        });
      }
    } else if (creep.memory.task == "BREAK") {
      let response = creep.dismantle(breakOBJ);
      if (response == ERR_NOT_IN_RANGE) {
        creep.moveTo(breakOBJ, {
          visualizePathStyle: { stroke: "#ffaa00" },
        });
      } else if (response == OK) {
        utilities.roleUtilities.sayState(creep, "BREAK", true);
      } else {
        utilities.roleUtilities.sayState(creep, "ERROR", true);
      }
    }
  },
};

module.exports.Breaker = roleBreaker;
