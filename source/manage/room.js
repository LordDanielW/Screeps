//  Run Room
//
runRoom = function (theRoom) {
  // if (!Memory.TaskMan[theRoom]) {
  //   console.log("No TaskMan for room " + theRoom);
  //   return;
  // }

  Memory.Tick;
  if (Memory.Tick && Memory.Tick == 1) {
    // generate spawn queue
    runSpawnQueue(theRoom);
    // Memory.TaskMan[theRoom].spawnQueue = manage.generateSpawnQueue(theRoom);
  }

  //  run Linker Transfer
  //
  // manage.runLinkerTransfer(myRoomOne);

  // run Factory
  //
  // manage.runFactory(myRoomOne);

  // run Spawn
  //
  const spawns = Game.rooms[theRoom].find(FIND_MY_STRUCTURES, {
    filter: { structureType: STRUCTURE_SPAWN },
  });

  for (const spawn of spawns) {
    runSpawner(spawn);
  }

  // //  Run Towers
  // //  check repair, heal, and attack
  // //  show attack rings
  // var towers = room.find(FIND_STRUCTURES, {
  //   filter: (structure) => {
  //     return structure.structureType == STRUCTURE_TOWER;
  //   },
  // });
  // for (var i = 0; i < towers.length; i++) {
  //   manage.Tower.run(towers[i]);
  //   if (showGraphics) {
  //     utils.displayAttackRings(room.name, towers[i]);
  //   }
  // }
};

module.exports.runRoom = runRoom;

//  Run Links
//
runLinks = function (theRoom) {
  let linkFrom = null;
  let linkTo = null;

  if (Memory.TaskMan[theRoom].linkFrom) {
    linkFrom = Game.getObjectById(Memory.TaskMan[theRoom].linkFrom);
  }
  if (Memory.TaskMan[theRoom].linkTo) {
    linkTo = Game.getObjectById(Memory.TaskMan[theRoom].linkTo);
  }

  if (linkFrom && linkTo) {
    if (linkFrom.store.getUsedCapacity(RESOURCE_ENERGY) >= 500) {
      linkFrom.transferEnergy(linkTo);
    }
  }
};
