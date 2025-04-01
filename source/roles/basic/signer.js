//
//
var roleSigner = {
  /** @param {Creep} creep **/
  run: function (creep) {
    creepTasks = ["MOVIN", "CLAIM"];

    if (!creepTasks.includes(creep.memory.task)) {
      creep.memory.task = "MOVIN";
      return;
    }

    if (creep.memory.task == "CLAIM") {
      if (creep.room.controller) {
        if (
          creep.signController(creep.room.controller, "👽 👾 🤖") ==
          ERR_NOT_IN_RANGE
        ) {
          creep.moveTo(creep.room.controller);
        } else {
          creep.claimController(creep.room.controller);
        }
      }

      //creep.memory.atDest = false;
      //creep.memory.sitPOS = new RoomPosition(33,14,"E45N33");
      this.sing(creep);
    }
    // MOVIN
    //
    else if (creep.memory.task == "MOVIN") {
      let flagPOS = Game.flags["Flag1"].pos;

      if (creep.pos.inRangeTo(flagPOS, 2)) {
        creep.memory.task = "CLAIM";
      } else {
        utils.action.moveTo(creep, flagPOS);
      }
    }
  },

  sing: function (creep) {
    switch (creep.memory.say) {
      case 1:
        creep.say("We render", true);
        break;
      case 2:
        creep.say("appropriate", true);
        break;
      case 3:
        creep.say("greetings", true);
        break;
      case 4:
        creep.say("👽 👾 🤖", true);
        creep.memory.say = 0;
        break;
    }
    creep.memory.say++;
  },
};

module.exports.Signer = roleSigner;
