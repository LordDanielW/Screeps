//
//
//
var roleUpCarrier = {
  /** @param {Creep} creep **/
  run: function (creep) {
    if (creep.store.getUsedCapacity() == 0 && creep.memory.task != "GET") {
      creep.memory.task = "GET";
      creep.say("🔄 GET", true);
    } else if (
      creep.memory.task == "GET" &&
      creep.store.getUsedCapacity() != 0
    ) {
      creep.memory.task = "GIVE";
      creep.say("🌻 GIVE", true);
    }
    if (creep.memory.task == "GET") {
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
      // if GIVE
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
};

module.exports.upCarrier = roleUpCarrier;
