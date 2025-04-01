//
//
var roleBlinker = {
  /** @param {Creep} creep **/
  run: function (creep) {
    creep.heal(creep);
    // creep.memory.task = "BREAK";
    // creep.memory.roomPos = { x: 49, y: 12, roomName: "E9N54" };
    // creep.memory.break = "645726bebc2f4b95ec1a04f1";

    creepTasks = ["MOVIN", "BREAK", "HEAL", "SIT"];

    if (!creepTasks.includes(creep.memory.task)) {
      utils.action.sayState(creep, "IDLE", true);
      return;
    }

    // Selected Destination from Memory
    let breakOBJ = Game.getObjectById(creep.memory.break);

    let breakPos = new RoomPosition(
      creep.memory.roomPos.x,
      creep.memory.roomPos.y,
      creep.memory.roomPos.roomName
    );

    // MOVIN
    //
    if (creep.memory.task == "MOVIN") {
      let flagPOS = Game.flags["Flag4"].pos;

      if (creep.pos.inRangeTo(flagPOS, 2)) {
        creep.memory.task = "SIT";
        creep.memory.flagPOS = flagPOS;
      } else {
        creep.heal(creep);
        utils.action.sayState(creep, "MOVE", true);
        creep.moveTo(flagPOS, { reusePath: 4 });
      }
    } else if (creep.memory.task == "BREAK") {
      // Check Creep health, if les than half change task to HEAL
      if (creep.hits < creep.hitsMax / 2 + 800) {
        creep.memory.task = "HEAL";
      }
    } else if (creep.memory.task == "HEAL") {
      // Move to range 6 of SafeFlag
      let safeFlag = Game.flags["SafeFlag"];

      if (!creep.pos.inRangeTo(safeFlag, 4)) {
        creep.moveTo(safeFlag);
      }
      // console.log(
      //   "creep.hits: " + creep.hits + " creep.hitsMax: " + creep.hitsMax
      // );
      if (creep.hits == creep.hitsMax) {
        creep.memory.task = "MOVIN";
      }
    }
    // SIT
    //
    else if (creep.memory.task == "SIT") {
      // check Memory for next task
      let flagPOSCheck = Game.flags["Flag4"].pos;
      if (flagPOSCheck != creep.memory.flagPOS) {
        creep.memory.task = "MOVIN";
        return;
      }
    }
  },
};

module.exports.Blinker = roleBlinker;
