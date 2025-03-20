var memGOB = {
  /** @param {Creep} creep **/
  getMyGOB: function () {
    var thisGOB = new {}();

    // Room W17N38
    var RoomW17N38 = new {}();
    var structures = Game.rooms.W17N38.find(FIND_STRUCTURES, {
      filter: (structure) => {
        return structure.structureType == STRUCTURE_LINK;
      },
    });
    for (var struct in structures) {
      switch (struct.structureType) {
        case STRUCTURE_LINK:
          RoomW17N38.structures.links.push(struct);
          break;
        case STRUCTURE_TOWER:
          RoomW17N38.structures.towers.push(struct);
          break;
        case STRUCTURE_EXTENSION:
          if (struct.energy < struct.energyCapacity) {
            RoomW17N38.structures.extensions.push(struct);
          }
          break;
        case STRUCTURE_SPAWNER:
          if (struct.energy < struct.energyCapacity) {
            RoomW17N38.structures.spawners.push(struct);
          }
          break;
        case STRUCTURE_CONTAINER:
          RoomW17N38.structures.containers.push(struct);
          break;
        case STRUCTURE_STORAGE:
          RoomW17N38.structures.storages.push(struct);
          break;
        case STRUCTURE_:
          RoomW17N38.structures.push(struct);
          break;
      }
    }

    thisGOB.RoomW17N38 = RoomW17N38;

    return thisGOB;
  },
};

module.exports = memGOB;

//  Extra Code
//
//

// var my = {}
// my.room = 'W17N38'
// my.tickUptime = -1
// my.tickDiff = Game.time

// function logIt() {
//     var roomEnergyStock = 0
//     _(Game.rooms[my.room]
//       .find(FIND_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_CONTAINER }))
//       .each((s) => (roomEnergyStock += s.store.energy))

//     my.e = Game.rooms[my.room].energyAvailable
//     my.ec = Game.rooms[my.room].energyCapacityAvailable
//     my.tickUptime += 1
//     var tOut = ""
//     tOut = tOut + ""
//     tOut = tOut + '  T: ' + (Game.time - my.tickDiff)
//     tOut = tOut + ', t:' + my.tickUptime
//     tOut = tOut + ', L: ' + Game.cpu.limit
//     tOut = tOut + ', tL: ' + Game.cpu.tickLimit
//     tOut = tOut + ', b: ' + Game.cpu.bucket
//     tOut = tOut + ', e: ' + my.e + '/' + my.ec + ', se: ' + roomEnergyStock
//     console.log(tOut)
// }

// module.exports.loop = function () {
//     // Memory Clean Up
//     for (var name in Memory.creeps) {
//         if (Game.creeps[name] == undefined) {
//             delete Memory.creeps[name]
//         }
//     }
//     logIt()
// }

function genUtils() {
  //clock in all rooms
  var time = Game.time % 1500;
  for (var key in Game.rooms) {
    Game.rooms[key].visual.text("Time: " + time, 10, 49, {
      color: "white",
      font: 1,
    });
  }

  //attack logs in all rooms
  for (var key in Game.rooms) {
    var tempRoom = Game.rooms[key];
    if (typeof tempRoom.memory.attackLogs == "undefined") {
      tempRoom.memory.attackLogs = [];
    }
    if (typeof tempRoom.memory.underAttackFlag == "undefined") {
      tempRoom.memory.underAttackFlag = false;
    }

    var ensInRoom = tempRoom.find(FIND_HOSTILE_CREEPS);
    if (ensInRoom.length > 0) {
      if (tempRoom.memory.underAttackFlag == false) {
        tempRoom.memory.underAttackFlag = true;
        tempRoom.memory.attackLogs.push(Game.time);
        if (tempRoom.memory.attackLogs.length > 10) {
          tempRoom.memory.attackLogs.shift();
        }
      }
    } else {
      tempRoom.memory.underAttackFlag = false;
    }
    if (tempRoom.memory.attackLogs.length > 0) {
      tempRoom.visual.text(
        "Ticks since last attack: " +
          (Game.time -
            tempRoom.memory.attackLogs[tempRoom.memory.attackLogs.length - 1]),
        10,
        48,
        { color: "red", font: 1 }
      );
    }
  }
}

//  Add construction
//  var path = room.findPath(srcs[i].pos,targPos, {ignoreCreeps: true, range: 1});
