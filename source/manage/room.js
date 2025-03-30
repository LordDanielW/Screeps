//  Run Room
//
runRoom = function (theRoom) {
  // if (!Memory.TaskMan[theRoom]) {
  //   console.log("No TaskMan for room " + theRoom);
  //   return;
  // }

  Memory.Tick;
  // if (Memory.Tick && Memory.Tick == 1) {
  //   // generate spawn queue
  //   Memory.TaskMan[theRoom].spawnQueue = manage.generateSpawnQueue(theRoom);
  // }

  //  run Linker Transfer
  //
  // manage.runLinkerTransfer(myRoomOne);

  // run Factoryk
  //
  // manage.runFatcory(myRoomOne);

  // Check for emergency spawn situations
  myMemory.generateEmergencySpawnQueue();

  // run Spawn
  //
  for (const spawnName in Game.spawns) {
    spawnCreeps(spawnName);
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
