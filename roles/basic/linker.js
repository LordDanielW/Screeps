//
//
//
var roleLinker = {
  /** @param {Creep} creep **/
  run: function (creep) {
    //  Variables
    let state = "NONE";

    // If Creep source and destination are not set, set them
    if (creep.memory.source == null) {
      creep.memory.source = Memory.TaskMan[creep.room.name].linkSource;
    }
    if (creep.memory.destination == null) {
      creep.memory.destination = Memory.TaskMan[creep.room.name].linkFrom;
    }
    // If creep resource is not set, set it
    if (creep.memory.resource == null) {
      creep.memory.resource = RESOURCE_ENERGY;
    }

    // Check State Of Get / Give
    //
    if (creep.store.getUsedCapacity() == 0 && creep.memory.task == "GIVE") {
      creep.memory.task = "GET";
    } else if (
      creep.memory.task == "GET" &&
      creep.store.getFreeCapacity() == 0
    ) {
      creep.memory.task = "GIVE";
      creep.say("🦑", true);
    } else if (creep.memory.task != "GET" && creep.memory.task != "GIVE") {
      creep.memory.task = "GET";
    }

    //  Get
    //
    if (creep.memory.task == "GET") {
      let sourceId = creep.memory.source;

      utils.role.getEnergyFromID(creep, sourceId, creep.memory.resource);
    }
    //  Give
    //
    else if (creep.memory.task == "GIVE") {
      let giveId = creep.memory.destination;
      let giveOBJ = Game.getObjectById(giveId);

      let response = creep.transfer(giveOBJ, creep.memory.resource);
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
