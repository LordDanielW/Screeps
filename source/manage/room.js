//  Run Room
//
runRoom = function (roomName) {
  if (!Memory.Tick) Memory.Tick = 0;

  const room = Game.rooms[roomName];
  // if (!Memory.TaskMan[roomName]) {
  //   console.log("No TaskMan for room " + roomName);
  //   return;
  // }

  switch (Memory.Tick) {
    case 1:
      // generate spawn queue
      runSpawnQueue(roomName);
      break;
    case 500:
      //
      if (
        Memory.TaskMan[roomName].claimRoom &&
        Memory.TaskMan[roomName].claimRoom.length > 0
      ) {
        for (let claimRoom in Memory.TaskMan[roomName].claimRoom) {
          runClaimQueue(roomName, claimRoom);
        }
      }
      break;
  }

  // Display room visuals
  if (showGraphics) {
    displayRoomVisuals(room);
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
      utils.displayAttackRings(towers[i]);
    }
  }
};

function getCreepStats(room) {
  const creeps = _.filter(
    Game.creeps,
    (creep) => creep.room.name === room.name
  );
  const creepCounts = _.countBy(creeps, (creep) => creep.memory.role);
  return { creeps, creepCounts };
}

function displayRoomVisuals(room) {
  const visual = room.visual;

  // Display Memory.Tick and Energy mined
  const totalEnergyMined = _.sum(
    (Memory.TaskMan[room.name] && Memory.TaskMan[room.name].energyMined) || []
  );

  visual.rect(1, 1, 10, 6, { fill: "black", opacity: 0.5 });
  visual.text(`Tick: ${Memory.Tick}`, 2, 2, { align: "left", color: "white" });
  visual.text(`Energy Mined: ${totalEnergyMined}`, 2, 3, {
    align: "left",
    color: "white",
  });
  visual.text(
    `Spawn: ${room.energyAvailable}/${room.energyCapacityAvailable}`,
    2,
    4,
    { align: "left", color: "white" }
  );
  const sources = room.find(FIND_SOURCES);
  const totalEnergy = _.sum(sources, (source) => source.energy);
  visual.text(`Total Energy: ${totalEnergy}`, 2, 5, {
    align: "left",
    color: "white",
  });

  // Get creep stats
  const { creeps, creepCounts } = getCreepStats(room);

  // Display total creeps
  visual.text(`Creeps: ${creeps.length}`, 2, 6, {
    align: "left",
    color: "white",
  });

  // Display creep roles in the second column
  let yOffset = 2;
  visual.text(`Creep Roles:`, 12, yOffset++, { align: "left", color: "white" });
  for (const [role, count] of Object.entries(creepCounts)) {
    visual.text(`${role}: ${count}`, 12, yOffset++, {
      align: "left",
      color: "white",
    });
  }

  // Display Spawn Queue near the spawner
  const spawns = room.find(FIND_MY_SPAWNS);
  spawns.forEach((spawn) => {
    const spawnQueue =
      (Memory.TaskMan[spawn.name] && Memory.TaskMan[spawn.name].spawnList) ||
      [];
    visual.rect(spawn.pos.x + 1, spawn.pos.y - 1, 8, 3, {
      fill: "black",
      opacity: 0.5,
    });
    visual.text(`Spawn Queue:`, spawn.pos.x + 2, spawn.pos.y, {
      align: "left",
      color: "white",
    });

    spawnQueue.slice(0, 3).forEach((task, index) => {
      visual.text(
        `${index + 1}. ${task.role}`,
        spawn.pos.x + 2,
        spawn.pos.y + index + 1,
        { align: "left", color: "white" }
      );
    });
  });
}

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
