//
//
//
var roleUpCarrier = {
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
      let sourceId = Memory.TaskMan[creep.room.name].upCarryId;
      utils.action.getResourceById(creep, sourceId);
    }
    //  Give
    //
    else if (creep.memory.task == "GIVE") {
      let giveId = Memory.TaskMan[creep.room.name].upgradeContainer;
      let giveOBJ = Game.getObjectById(giveId);

      let response = creep.transfer(giveOBJ, RESOURCE_ENERGY);
      if (response == ERR_NOT_IN_RANGE) {
        utils.action.moveTo(creep, giveOBJ);
      }
    } else {
      creep.memory.task = "GET";
    }
  },
};

module.exports.upCarrier = roleUpCarrier;

// //
// //
// //
// var roleUpCarrier = {
//   /** @param {Creep} creep **/
//   run: function (creep) {
//     if (creep.store.getUsedCapacity() == 0 && creep.memory.task != "GET") {
//       creep.memory.task = "GET";
//       creep.say("🔄 GET", true);
//     } else if (
//       creep.memory.task == "GET" &&
//       creep.store.getUsedCapacity() != 0
//     ) {
//       creep.memory.task = "GIVE";
//       creep.say("🌻 GIVE", true);
//     }
//     if (creep.memory.task == "GET") {
//       const target = creep.room.find(FIND_STRUCTURES, {
//         filter: (d) => {
//           return d.structureType == STRUCTURE_CONTAINER;
//         },
//       });
//       //const target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
//       if (target != null) {
//         //if(creep.pickup(target) == ERR_NOT_IN_RANGE) {
//         if (creep.withdraw(target[2], RESOURCE_LEMERGIUM))
//           creep.moveTo(target[2]);
//       }
//       //}
//     } else {
//       // if GIVE
//       var factory = creep.room.find(FIND_STRUCTURES, {
//         filter: (d) => {
//           return d.structureType == STRUCTURE_FACTORY;
//         },
//       })[0];
//       //Memory.Foo = (factory.store.battery < 5000);
//       if (creep.transfer(factory, RESOURCE_LEMERGIUM) == ERR_NOT_IN_RANGE) {
//         creep.moveTo(factory, { visualizePathStyle: { stroke: "#00ffff" } });
//       }
//       //utils.action.emptyCarry(creep);
//     }
//   },
// };

// module.exports.upCarrier = roleUpCarrier;
