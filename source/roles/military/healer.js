//
//
var roleHealer = {
  /** @param {Creep} creep **/
  run: function (creep) {
    // creep.memory.task = "BREAK";
    // creep.memory.roomPos = { x: 49, y: 12, roomName: "E9N54" };
    // creep.memory.break = "645726bebc2f4b95ec1a04f1";

    creepTasks = ["MOVIN", "HEAL"];

    if (!creepTasks.includes(creep.memory.task)) {
      utils.role.sayState(creep, "IDLE", true);
      return;
    }

    // create pos from memory
    let movePos = new RoomPosition(
      creep.memory.movePos.x,
      creep.memory.movePos.y,
      creep.memory.movePos.roomName
    );

    if (creep.memory.task == "MOVIN") {
      if (creep.pos.isEqualTo(movePos)) {
        // if (creep.pos.inRangeTo(breakPos, 1)) {
        creep.memory.task = "HEAL";
        utils.role.sayState(creep, "HEAL", true);
        this.run(creep);
      } else {
        utils.role.sayState(creep, "MOVE", true);
        creep.heal(creep);
        creep.moveTo(movePos, {
          visualizePathStyle: { stroke: "#ffaa00" },
        });
      }
    } else if (creep.memory.task == "HEAL") {
      let response = creep.dismantle(breakOBJ);
      if (response == ERR_NOT_IN_RANGE) {
        creep.heal(creep);
        creep.moveTo(breakOBJ, {
          visualizePathStyle: { stroke: "#ffaa00" },
        });
      } else if (response == OK) {
        utils.role.sayState(creep, "BREAK", true);
      } else {
        utils.role.sayState(creep, "ERROR", true);
      }
    }
  },
};

module.exports.Healer = roleHealer;
