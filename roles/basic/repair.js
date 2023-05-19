//
//
//
var roleRepair = {
  /** @param {Creep} creep **/
  run: function (creep) {
    //creep.memory.task = "REPAIR";
    if (creep.carry.energy == 0 && creep.memory.task == "REPAIR") {
      creep.memory.task = "GET";
      creep.say("🔋", true);
    }
    if (
      creep.memory.task == "GET" &&
      creep.carry.energy == creep.carryCapacity
    ) {
      creep.memory.task = "REPAIR";
      creep.say("🛠️", true);
    }

    // REPAIR
    if (creep.memory.task == "REPAIR") {
      var closestDamagedStructure = creep.pos.findClosestByRange(
        FIND_STRUCTURES,
        {
          filter: (structure) =>
            structure.hits < structure.hitsMax - 500 &&
            structure.structureType != STRUCTURE_WALL &&
            structure.structureType != STRUCTURE_RAMPART,
        }
      );
      if (closestDamagedStructure) {
        var rtnMsg = creep.repair(closestDamagedStructure);
        if (rtnMsg == ERR_NOT_IN_RANGE) {
          utils.role.moveTo(creep, closestDamagedStructure);
        } else if (rtnMsg == OK) {
          creep.say("🧙 PEW ✨", true);
        }
      } else {
        var wallHealth = Memory.TaskMan[creep.pos.roomName].wallHealth;
        var wallUpgrade = creep.pos.findClosestByRange(FIND_STRUCTURES, {
          filter: (structure) =>
            (structure.hits < wallHealth &&
              structure.structureType == STRUCTURE_WALL) ||
            (structure.structureType == STRUCTURE_RAMPART &&
              structure.hits < wallHealth),
        });
        if (wallUpgrade) {
          var rtnMsg = creep.repair(wallUpgrade);
          if (rtnMsg == ERR_NOT_IN_RANGE) {
            utils.role.moveTo(creep, wallUpgrade);
          } else if (rtnMsg == OK) {
            creep.say("🧙 PEW ✨", true);
          }
        } else {
          Memory.TaskMan[creep.pos.roomName].wallHealth = wallHealth + 500;
        }
      }
      // GET
    } else if (creep.memory.task == "GET") {
      utils.role.getResource(creep);
      // MOVIN
    } else if (creep.memory.task == "MOVIN") {
      var mPOS = creep.memory.movePOS;
      var moveTO = new RoomPosition(mPOS.x, mPOS.y, mPOS.roomName);
      //var nextRoom = new RoomPosition(6, 17, "W16N38");
      if (creep.pos.isEqualTo(moveTO)) {
        creep.memory.task = "REPAIR";
      } else {
        //  creep.say(creep.memory.dest.x + ',' + creep.memory.dest.y);
        utils.role.moveTo(creep, moveTO);
        //utils.role.moveRooms(creep);
      }
    } else {
      creep.memory.task = "GET";
      //test
    }
  },
};

module.exports.Repair = roleRepair;
