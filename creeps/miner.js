var roleMiner = {
  /** @param {Creep} creep **/
  run: function (creep) {
    // creep.memory.sourceType = FIND_SOURCES;
    //creep.memory.sitPOS = new RoomPosition(37, 36, "E46N33");
    if (creep.memory.atDest) {
      var source = Game.getObjectById(creep.memory.source);
      var error = creep.harvest(source);
      if (error != OK) {
        // creep.say("Nope");
        // Memory.Foo = error;
        // creep.memory.atDest = false;
      }
      this.sing(creep);
    } else {
      var mPOS = creep.memory.sitPOS;
      var sitPOS = new RoomPosition(mPOS.x, mPOS.y, mPOS.roomName);
      if (creep.pos.isEqualTo(sitPOS)) {
        var SourceID = creep.pos.findClosestByRange(creep.memory.sourceType);
        //, {filter: (source) => source.energy > 0 });
        if (SourceID) {
          creep.memory.atDest = true;
          creep.memory.source = SourceID.id;
        }
      } else {
        creep.moveTo(sitPOS, { visualizePathStyle: { stroke: "#ffaa00" } });
      }
    }
  },
  build: function (creepMem) {
    var newName = "Miner" + Memory.TaskMan.NameNum;
    Memory.TaskMan.NameNum++;
    return Game.spawns[creepMem.memory.spawn].spawnCreep(
      this[creepMem.memory.body],
      newName,
      creepMem
    );
  },
  body2: [WORK, WORK, WORK, WORK, WORK, MOVE, MOVE],
  body1: [WORK, WORK, WORK, WORK, MOVE],
  body3: [
    WORK,
    WORK,
    WORK,
    WORK,
    WORK,
    WORK,
    WORK,
    WORK,
    MOVE,
    MOVE,
    MOVE,
    MOVE,
    WORK,
    WORK,
    WORK,
    WORK,
    WORK,
    WORK,
    WORK,
    WORK,
    MOVE,
    MOVE,
    MOVE,
    MOVE,
    WORK,
    WORK,
    WORK,
    WORK,
    WORK,
    WORK,
    WORK,
    WORK,
    MOVE,
    MOVE,
    MOVE,
    MOVE,
  ],
  sing: function (creep) {
    switch (creep.memory.say) {
      case 1:
        creep.say("du!", true);
        break;
      case 2:
        creep.say("du hast!", true);
        break;
      case 3:
        creep.say("du hast -", true);
        break;
      case 4:
        creep.say("mich!", true);
        break;
      case 5:
        creep.say(" 💥  💣 💥 ", true);
        creep.memory.say = 0;
        break;
      case 6:
        creep.say("Ya prishol", true);
        break;
      case 7:
        creep.say("daty etu", true);
        break;
      case 8:
        creep.say("piesnyu", true);
      case 9:
        creep.say("Ya prishol", true);
        break;
      case 10:
        creep.say("daty etu", true);
        break;
      case 11:
        creep.say("piesnyu", true);
      case 12:
        creep.say("Iz mira", true);
        break;
      case 13:
        creep.say("gryoz", true);
        break;
      case 14:
        creep.say("chum drum", true);
        break;
      case 15:
        creep.say("bedrum", true);
        creep.memory.say = 6;
        break;
    }
    creep.memory.say++;
  },
};

module.exports.Miner = roleMiner;
