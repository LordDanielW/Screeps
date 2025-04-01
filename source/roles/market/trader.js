//
//
//
var roleTrader = {
  /** @param {Creep} creep **/
  run: function (creep) {
    //  Variables
    let state = "NONE";

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
      // Selected Destination from Memory
      let fullSource = Game.getObjectById(creep.memory.source);

      // Move and transfer energy
      if (fullSource != null) {
        let response = creep.withdraw(fullSource, creep.memory.transferType);

        if (response == ERR_NOT_IN_RANGE) {
          creep.moveTo(fullSource, utils.action.pathStyle);
          state = "MOVE";
        } else if (response == OK) {
          state = "GET";
        }
      }
    }
    //  Give
    //
    else if (creep.memory.task == "GIVE") {
      // Selected Destination from Memory
      let emptyStructure = Game.getObjectById(creep.memory.dest);

      // Move and transfer energy
      if (emptyStructure != null) {
        let response = creep.transfer(
          emptyStructure,
          creep.memory.transferType
        );
        if (response == ERR_NOT_IN_RANGE) {
          creep.moveTo(emptyStructure, utils.action.pathStyle);
          state = "MOVE";
        } else if (response == OK) {
          state = "GET";
        } else {
          state = "ERROR";
        }
      } else {
        state = "ERROR";
      }
    }
    // Report state
    utils.action.sayState(creep, state, true);
  },
};

module.exports.Trader = roleTrader;
