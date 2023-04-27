var roleBuilder = {
  /** @param {Creep} creep **/
  run: function (creep) {
    //creep.memory.moveTO = { x: 24, y: 47, roomName: "W16N39"};
    // creep.memory.role = "Repair";
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

    if (creep.memory.task == "BUILD") {
      var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
      if (targets.length) {
        var target = creep.pos.findClosestByPath(targets);
        if (creep.build(target) == ERR_NOT_IN_RANGE) {
          creep.moveTo(target, { visualizePathStyle: { stroke: "#ffffff" } });
        }
      } else {
        //	creep.memory.task = 'movin';
        //	creep.say('🍄 Movin', true);
      }
    } else if (creep.memory.task == "MOVIN") {
      var mPOS = creep.memory.moveTO;
      var moveTO = new RoomPosition(mPOS.x, mPOS.y, mPOS.roomName);
      //var nextRoom = new RoomPosition(6, 17, "W16N38");
      if (creep.pos.isEqualTo(moveTO)) {
        creep.memory.task = "BUILD";
        creep.say("🚧 build", true);
      } else {
        //  creep.say(creep.memory.dest.x + ',' + creep.memory.dest.y);
        creep.moveTo(moveTO, { visualizePathStyle: { stroke: "#ffaa00" } });
        //roleUtilities.moveRooms(creep);
      }
    } else {
      // roleUtilities.getEnergyHarvest(creep);
      roleUtilities.getEnergyStorage(creep);
    }
  },
};

module.exports.Builder = roleBuilder;

// Memory.TaskMan.W17N38.spawn.queue.push({
//   Builder: {
//     memory: {
//       role: 'Builder', moveTO: { x: 24, y: 47, roomName: "W16N39"}, task:'movin'
//     }
//   }
// });
