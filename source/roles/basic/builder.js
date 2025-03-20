var roleBuilder = {
  /** @param {Creep} creep **/
  run: function (creep) {
    if (creep.carry.energy == 0 && creep.memory.task == "BUILD") {
      creep.memory.task = "GET";
      creep.say("🔄 get", true);
    } else if (
      creep.memory.task == "GET" &&
      creep.carry.energy == creep.carryCapacity
    ) {
      creep.memory.task = "BUILD";
      creep.say("🚧 build", true);
    } else if (
      creep.memory.task != "GET" &&
      creep.memory.task != "BUILD" &&
      creep.memory.task != "MOVIN"
    ) {
      creep.memory.task = "GET";
    }

    // BUILD
    if (creep.memory.task == "BUILD") {
      var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
      if (targets.length) {
        var target = creep.pos.findClosestByPath(targets);
        if (creep.build(target) == ERR_NOT_IN_RANGE) {
          utils.role.moveTo(creep, target);
        }
      }

      // MOVIN
    } else if (creep.memory.task == "MOVIN") {
      var mPOS = creep.memory.movePOS;
      var moveTO = new RoomPosition(mPOS.x, mPOS.y, mPOS.roomName);
      if (creep.pos.isEqualTo(moveTO)) {
        creep.memory.task = "BUILD";
        creep.say("🚧 build", true);
      } else {
        utils.role.moveTo(creep, moveTO);
      }

      // GET
    } else if (creep.memory.task == "GET") {
      utils.role.getResource(creep);
    }
  },
};

module.exports.Builder = roleBuilder;
