//
//
//
var roleLinker = {
  /** @param {Creep} creep **/
  run: function (creep) {
    //  Variables
    let state = "NONE";

    // Check State Of Get / Give
    //
    if (creep.carry.energy == 0 && creep.memory.task == "GIVE") {
      creep.memory.task = "GET";
    } else if (
      creep.memory.task == "GET" &&
      creep.carry.energy == creep.carryCapacity
    ) {
      creep.memory.task = "GIVE";
      creep.say("🦑", true);
    } else if (creep.memory.task != "GET" && creep.memory.task != "GIVE") {
      creep.memory.task = "GET";
    }

    //  Get
    //
    if (creep.memory.task == "GET") {
      let sourceId = Memory.TaskMan[creep.room.name].linkSource;

      utils.role.getEnergyFromID(creep, sourceId);
    }
    //  Give
    //
    else if (creep.memory.task == "GIVE") {
      let giveId = Memory.TaskMan[creep.room.name].linkFrom;
      let giveOBJ = Game.getObjectById(giveId);

      let response = creep.transfer(giveOBJ, RESOURCE_ENERGY);
      if (response == ERR_NOT_IN_RANGE) {
        utils.role.moveTo(creep, giveOBJ);
        state = "MOVE";
      } else if (response == OK) {
        state = "GIVE";
      } else {
        state = "ERROR";
      }

      // Report state
      utils.role.sayState(creep, state, true);
    } else {
      creep.memory.task = "GET";
    }
  },
};

module.exports.Linker = roleLinker;
