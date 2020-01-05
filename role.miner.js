var roleMiner = {
  /** @param {Creep} creep **/
  run: function (creep) {
    //creep.memory.sitPOS = new RoomPosition(13, 8, "W17N38");
    if (creep.memory.atDest) {
      var source = Game.getObjectById(creep.memory.source)
      if (creep.harvest(source) != OK) {
        creep.memory.atDest = false;
      }
      this.sing(creep);
    } else {
      var mPOS = creep.memory.sitPOS;
      var sitPOS = new RoomPosition(mPOS.x, mPOS.y, mPOS.roomName);
      if (creep.pos.isEqualTo(sitPOS)) {
        var SourceID = creep.pos.findClosestByRange(FIND_SOURCES, {
          filter: (source) => source.energy > 0
        });
        if (SourceID) {
          creep.memory.atDest = true;
          creep.memory.source = SourceID.id;
        }
      } else {
        creep.moveTo(sitPOS, { visualizePathStyle: { stroke: '#ffaa00' } });
      }
    }
  },
  build: function (creepMem) {
    var newName = 'Miner' + Memory.TaskMan.NameNum;
    Memory.TaskMan.NameNum++;
    Memory.Foo = creepMem;
    return Game.spawns[creepMem.memory.spawn].spawnCreep(this[creepMem.memory.body], newName, creepMem);
  },
  body1: [WORK, WORK, MOVE],
  body2: [WORK, WORK,  WORK, MOVE, MOVE],
  body3: [WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE],
  sing: function (creep) {
    switch (creep.memory.say) {
      case 1:
        creep.say("Hi Ho ⛏️", true);
        break;
      case 2:
        creep.say("⛏️ Hi Ho", true);
        break;
      case 3:
        creep.say("It's off", true);
        break;
      case 4:
        creep.say("to work", true);
        break;
      case 5:
        creep.say("we go 🤮", true);
        creep.memory.say = 0;
        break;
      case 6:
        creep.say("You want a", true);
        break;
      case 7:
        creep.say("Hot Body?🐤", true);
        break;
      case 8:
        creep.say("You want a", true);
        break;
      case 9:
        creep.say("Bugatti?🚗", true);
        break;
      case 10:
        creep.say("You want a", true);
        break;
      case 11:
        creep.say("Maserati?🚚", true);
        break;
      case 12:
        creep.say("You better", true);
        break;
      case 13:
        creep.say("work B💇🏼‍", true);
        break;
      case 14:
        creep.say("Now get to", true);
        break;
      case 15:
        creep.say("work B💇🏾‍", true);
        creep.memory.say = 5;
        break;
    }
    creep.memory.say++;
  }
};

module.exports = roleMiner;