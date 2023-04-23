var roleUtilities = require("role.Utilities");
var roleSigner = {
  /** @param {Creep} creep **/
  run: function (creep) {
    if (creep.memory.atDest) {
      if (creep.room.controller) {
        if (
          creep.signController(creep.room.controller, "The Boop Room") ==
          ERR_NOT_IN_RANGE
        ) {
          creep.moveTo(creep.room.controller);
        }
      }
      // if (creep.room.controller) {
      //   if (creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
      //     creep.moveTo(creep.room.controller);
      //   }
      // }
      //creep.memory.atDest = false;
      //creep.memory.sitPOS = new RoomPosition(33,14,"E45N33");
      this.sing(creep);
    } else {
      var mPOS = creep.memory.sitPOS;
      var sitPOS = new RoomPosition(mPOS.x, mPOS.y, mPOS.roomName);
      Memory.Foo = mPOS;
      if (creep.pos.isEqualTo(sitPOS)) {
        creep.memory.atDest = true;
      } else {
        creep.moveTo(sitPOS, { visualizePathStyle: { stroke: "#ffaa00" } });
      }
    }
  },
  body: [MOVE], //CLAIM, CLAIM, MOVE, MOVE],
  build: function (creepMem) {
    var newName = "👽 👾 🤖" + Memory.TaskMan.NameNum;
    Memory.TaskMan.NameNum++;
    return Game.spawns[creepMem.memory.spawn].spawnCreep(
      this.body,
      newName,
      creepMem
    );
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
        creep.memory.say = 0;
        break;
    }
    creep.memory.say++;
  },
};

module.exports = roleSigner;

// Memory.TaskMan.E46N33.spawn.push({
//   Signer: {
//     memory: {
//       role: 'Signer', say: 1, atDest: false, sitPOS: { x: 34, y: 35, roomName: "E45N34" }, spawn: "Vat1"
//     }
//   }
// });
