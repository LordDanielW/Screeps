//
//
var roleAttacker = {
  /** @param {Creep} creep **/
  run: function (creep) {
    // creep.memory.task = "ATTACK";
    // creep.memory.roomPos = { x: 48, y: 25, roomName: "E9N54" };

    creepTasks = ["MOVIN", "ATTACK"];

    if (!creepTasks.includes(creep.memory.task)) {
      creep.memory.task = "ATTACK";
      return;
    }

    if (creep.memory.task != "MOVIN" && creep.memory.task != "ATTACK") {
      utilities.roleUtilities.sayState(creep, "IDLE", true);
      return;
    }

    if (creep.memory.task == "MOVIN") {
      let attackRoom = new RoomPosition(
        creep.memory.roomPos.x,
        creep.memory.roomPos.y,
        creep.memory.roomPos.roomName
      );
      if (creep.pos.inRangeTo(attackRoom, 1)) {
        creep.memory.task = "ATTACK";
        utilities.roleUtilities.sayState(creep, "ATTACK", true);
        this.run(creep);
      } else {
        utilities.roleUtilities.sayState(creep, "MOVE", true);
        creep.moveTo(attackRoom, {
          visualizePathStyle: { stroke: "#ffaa00" },
        });
      }
    } else if (creep.memory.task == "ATTACK") {
      const target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
      if (target) {
        if (creep.attack(target) == ERR_NOT_IN_RANGE) {
          creep.moveTo(target);
        }
      }
    }
  },
};

module.exports.Attacker = roleAttacker;