var roleUtilities = require("role.Utilities");
var roleUpCarrier = {
  /** @param {Creep} creep **/
  run: function (creep) {
    if (creep.store.getUsedCapacity() == 0 && creep.memory.task != "reap") {
      creep.memory.task = "reap";
      creep.say("🔄 reap", true);
    } else if (
      creep.memory.task == "reap" &&
      creep.store.getUsedCapacity() != 0
    ) {
      creep.memory.task = "sow";
      creep.say("🌻 sow", true);
    }
    if (creep.memory.task == "reap") {
      const target = creep.room.find(FIND_STRUCTURES, {
        filter: (d) => {
          return d.structureType == STRUCTURE_CONTAINER;
        },
      });
      //const target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
      if (target != null) {
        //if(creep.pickup(target) == ERR_NOT_IN_RANGE) {
        if (creep.withdraw(target[2], RESOURCE_LEMERGIUM))
          creep.moveTo(target[2]);
      }
      //}
    } else {
      // if Sow
      var factory = creep.room.find(FIND_STRUCTURES, {
        filter: (d) => {
          return d.structureType == STRUCTURE_FACTORY;
        },
      })[0];
      //Memory.Foo = (factory.store.battery < 5000);
      if (creep.transfer(factory, RESOURCE_LEMERGIUM) == ERR_NOT_IN_RANGE) {
        creep.moveTo(factory, { visualizePathStyle: { stroke: "#00ffff" } });
      }
      //roleUtilities.emptyCarry(creep);
    }
  },
  body1: [CARRY, MOVE, CARRY, MOVE, CARRY, MOVE],
  build: function (creepMem) {
    var newName = "UpCarry" + Memory.TaskMan.NameNum;
    Memory.TaskMan.NameNum++;
    return Game.spawns[creepMem.memory.spawn].spawnCreep(
      this[creepMem.memory.body],
      newName,
      creepMem
    );
  },
};

module.exports = roleUpCarrier;
