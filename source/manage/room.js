//  Run Room
//
runRoom = function (roomName) {
  const room = Game.rooms[roomName];
  // if (!Memory.TaskMan[roomName]) {
  //   console.log("No TaskMan for room " + roomName);
  //   return;
  // }

  Memory.Tick;
  if (Memory.Tick && Memory.Tick == 1) {
    // generate spawn queue
    runSpawnQueue(roomName);
    // Memory.TaskMan[roomName].spawnQueue = manage.generateSpawnQueue(roomName);
  }

  //  run Linker Transfer
  //
  // manage.runLinkerTransfer(myRoomOne);

  // run Factory
  //
  // manage.runFactory(myRoomOne);

  // run Spawn
  //
  const spawns = room.find(FIND_MY_STRUCTURES, {
    filter: { structureType: STRUCTURE_SPAWN },
  });

  for (const spawn of spawns) {
    runSpawner(spawn);
  }

  //  Run Towers
  //  check repair, heal, and attack
  //  show attack rings
  var towers = room.find(FIND_STRUCTURES, {
    filter: (structure) => {
      return structure.structureType == STRUCTURE_TOWER;
    },
  });
  for (var i = 0; i < towers.length; i++) {
    runTower(towers[i]);
    if (showGraphics) {
      // utils.displayAttackRings(room.name, towers[i]);
    }
  }
};

module.exports.runRoom = runRoom;

//  Run Links
//
runLinks = function (roomName) {
  let linkFrom = null;
  let linkTo = null;

  if (Memory.TaskMan[roomName].linkFrom) {
    linkFrom = Game.getObjectById(Memory.TaskMan[roomName].linkFrom);
  }
  if (Memory.TaskMan[roomName].linkTo) {
    linkTo = Game.getObjectById(Memory.TaskMan[roomName].linkTo);
  }

  if (linkFrom && linkTo) {
    if (linkFrom.store.getUsedCapacity(RESOURCE_ENERGY) >= 500) {
      linkFrom.transferEnergy(linkTo);
    }
  }
};
