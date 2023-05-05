//
//
var roleClaimer = {
  /** @param {Creep} creep **/
  run: function (creep) {
    // creep.memory.task = "MOVIN";
    // creep.memory.roomPos = { x: 48, y: 25, roomName: "E9N54" };
    creep.memory.claim = "6453dd062dcf1466c079d6d8";

    if (creep.memory.task != "MOVIN" && creep.memory.task != "CLAIM") {
      utilities.roleUtilities.sayState(creep, "IDLE", true);
      return;
    }

    // Selected Destination from Memory
    let claimOBJ = Game.getObjectById(creep.memory.claim);

    let claimPos = new RoomPosition(
      creep.memory.roomPos.x,
      creep.memory.roomPos.y,
      creep.memory.roomPos.roomName
    );

    if (creep.memory.task == "MOVIN") {
      if (creep.pos.inRangeTo(claimPos, 1)) {
        creep.memory.task = "CLAIM";
        utilities.roleUtilities.sayState(creep, "CLAIM", true);
        this.run(creep);
      } else {
        utilities.roleUtilities.sayState(creep, "MOVE", true);
        creep.moveTo(claimPos, {
          visualizePathStyle: { stroke: "#ffaa00" },
        });
      }
    } else if (creep.memory.task == "CLAIM") {
      let response = creep.claimController(claimOBJ);
      if (response == ERR_NOT_IN_RANGE) {
        creep.moveTo(claimOBJ, {
          visualizePathStyle: { stroke: "#ffaa00" },
        });
      } else if (response == OK) {
        utilities.roleUtilities.sayState(creep, "CLAIM", true);
      } else {
        utilities.roleUtilities.sayState(creep, "ERROR", true);
      }
    }
  },
};

module.exports.Claimer = roleClaimer;
