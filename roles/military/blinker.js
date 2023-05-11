//
//
var roleBlinker = {
  /** @param {Creep} creep **/
  run: function (creep) {
    creep.heal(creep);
    // creep.memory.task = "BREAK";
    // creep.memory.roomPos = { x: 49, y: 12, roomName: "E9N54" };
    // creep.memory.break = "645726bebc2f4b95ec1a04f1";

    creepTasks = ["MOVIN", "BREAK", "HEAL"];

    if (!creepTasks.includes(creep.memory.task)) {
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
      if (creep.pos.isEqualTo(breakPos)) {
        // if (creep.pos.inRangeTo(breakPos, 1)) {
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
      // Check Creep health, if les than half change task to HEAL
      if (creep.hits < creep.hitsMax / 2 + 800) {
        creep.memory.task = "HEAL";
      }
    }
    if (creep.memory.task == "HEAL") {
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
  },
};

module.exports.Blinker = roleBlinker;
