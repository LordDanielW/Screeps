const SPAWN_PARAMETERS_DEFAULT = {
  role: "Carrier",
  task: "GET",
  source: [],
  spawn: "Spawn1",
  body: [
    [MOVE, 1],
    [WORK, 1],
    [CARRY, 1],
  ],
};

//  Spawn Creeps
//
spawnCreeps = function (spawnName) {
  let spawn = Game.spawns[spawnName];
  let roomName = spawn.room.name;

  if (!Memory.TaskMan[spawnName]) {
    // console.log("Spawn: " + spawnName + " not found in Memory.TaskMan");
    return;
  }

  // If Spawn que overloaded, clear and make a Carrier
  if (Memory.TaskMan[spawnName].spawnList.length > 5) {
    Memory.TaskMan[spawnName].spawnList = [];
    Memory.TaskMan[spawnName].spawnList.push({ role: "Carrier" });
    Memory.TaskMan[spawnName].spawnListNumber = 0;
  }
  // If Spawning, Display it
  if (spawn.spawning) {
    utils.structureMessage(spawn.id, "🛠️" + spawn.spawning.name);
  }
  // Else Check Spawn Que
  else if (Memory.TaskMan[spawnName].spawnList.length != 0) {
    var spawnMemory = Memory.TaskMan[spawnName].spawnList[0];

    // Generate Unique Name
    let tName = spawnMemory.role;
    if (tName == "Signer") {
      tName = "👽 👾 🤖";
    }
    let newCreepName = tName + Memory.TaskMan.NameNum;

    // Build Body
    let creepBody = spawnMemory.body;
    if (!creepBody) {
      creepBody = SPAWN_PARAMETERS_DEFAULT.body;
    }

    let buildBody = [];
    for (let i = 0; i < creepBody.length; i++) {
      for (var j = 0; j < creepBody[i][1]; j++) {
        buildBody.push(creepBody[i][0]);
      }
    }

    // Keeps a unique name for spawned creeps
    Memory.TaskMan.NameNum++;
    if (Memory.TaskMan.NameNum >= 1000) {
      Memory.TaskMan.NameNum = 1;
    }

    // Try Spawn
    let response = Game.spawns[spawnName].spawnCreep(buildBody, newCreepName, {
      memory: spawnMemory,
      directions: spawnMemory.directions,
    });

    if (response == OK) {
      Memory.TaskMan[spawnName].spawnList.shift();
    } else {
      utils.structureMessage(spawn.id, "🎊 " + response);
      // console.log("Error " + response + ". Spawning:" + spawnMemory.role);
    }
  }
  //  Else add to Que
  else {
    this.addSpawnQue(spawnName);

    // TODO: Add Back Later
    // // Count Miners and Carriers
    // // ToDo add for multi Rooms
    // var countRoles = {};
    // for (var name in Game.creeps) {
    //   var role = Game.creeps[name].memory.role;
    //   if (countRoles[role] == null) {
    //     countRoles[role] = 1;
    //   } else {
    //     countRoles[role]++;
    //   }
    // }
    // // Check Carriers
    // if (countRoles.Carrier == undefined || countRoles.Carrier < 1) {
    //   Memory.TaskMan[spawnName].spawnList.push({ role: "Carrier" });
    // }
    // // Check Miners
    // else if (countRoles.Miner == undefined || countRoles.Miner < 1) {
    //   Memory.TaskMan[spawnName].spawnList.push({ role: "Miner" });
    // }
  }
};

module.exports.spawnCreeps = spawnCreeps;

//  Add Spawn Que
//
addSpawnQue = function (spawnName) {
  let spawnListNumber = Memory.TaskMan[spawnName].spawnListNumber;
  let spawnExtrasNumber = Memory.TaskMan[spawnName].spawnExtrasNumber;

  // Set if undefined
  if (spawnListNumber == undefined || spawnExtrasNumber == undefined) {
    Memory.TaskMan[spawnName].spawnListNumber = -1;
    Memory.TaskMan[spawnName].spawnExtrasNumber = -1;
  }
  // if end of list go to extras
  else if (spawnListNumber != -1) {
    if (myMemory.spawnList[spawnName].length <= spawnListNumber) {
      Memory.TaskMan[spawnName].spawnListNumber = -1;
      Memory.TaskMan[spawnName].spawnExtrasNumber = 0;
    }
    // Add routine creeps to spawn que
    else if (Memory.TaskMan[spawnName].spawn.length == 0) {
      Memory.TaskMan[spawnName].spawnList.push(
        myMemory.spawnList[spawnName][spawnListNumber]
      );
      Memory.TaskMan[spawnName].spawnListNumber++;
    }
  }
  // check for extras to add to spawn que
  else if (spawnExtrasNumber != -1) {
    this.conditionalSpawnQue(spawnName);
  }
};

module.exports.addSpawnQue = addSpawnQue;

//  more Creeps
conditionalSpawnQue = function (spawnName) {
  switch (Memory.TaskMan[spawnName].spawnExtrasNumber) {
    case 10:
      //  Check for Minerals
      if (
        Game.spawns[spawnName].room.find(FIND_MINERALS).length > 0 &&
        Game.spawns[spawnName].room.find(FIND_MINERALS)[0].mineralAmount > 0 &&
        Game.spawns[spawnName].room.find(FIND_STRUCTURES, {
          filter: (structure) => {
            return (
              structure.structureType == STRUCTURE_EXTRACTOR &&
              structure.isActive()
            );
          },
        }).length > 0
      ) {
        let mineralType = Game.spawns[spawnName].room.find(FIND_MINERALS)[0];

        let ePos = Game.spawns[spawnName].room.find(FIND_STRUCTURES, {
          filter: (structure) => {
            return (
              structure.structureType == STRUCTURE_EXTRACTOR &&
              structure.isActive()
            );
          },
        })[0].pos;

        // Find closest container by range
        let closestContainer = ePos.findClosestByRange(FIND_STRUCTURES, {
          filter: (structure) => {
            return structure.structureType == STRUCTURE_CONTAINER;
          },
        });
        if (closestContainer == null || closestContainer.pos.isNearTo()) {
          return;
        }
        let cPOS = closestContainer.pos;

        Memory.TaskMan[spawnName].spawnList.push({
          role: "Miner",
          say: 1,
          atDest: false,
          sourceType: FIND_MINERALS,
          body: [
            [WORK, 15],
            [MOVE, 5],
          ],
          sitPOS: { x: cPOS.x, y: cPOS.y, roomName: cPOS.roomName },
        });

        Memory.TaskMan[spawnName].spawnList.push({
          role: "Linker",
          resource: mineralType.mineralType,
          source: closestContainer.id,
          destination: Game.spawns[spawnName].room.terminal.id,
          body: [
            [CARRY, 8],
            [MOVE, 8],
          ],
        });
      }
      break;
    case 1:
      //  Check for Construction Sites
      let roomConstructionSites = false;
      Object.keys(Game.constructionSites).forEach((x) => {
        if (Game.constructionSites[x].room == Game.spawns[spawnName].room) {
          roomConstructionSites = true;
        }
      });
      if (roomConstructionSites) {
        let myBody = [];
        // Find body build by room energy
        if (Game.spawns[spawnName].room.energyCapacityAvailable >= 850) {
          myBody = [
            [WORK, 5],
            [CARRY, 2],
            [MOVE, 5],
          ];
        } else {
          myBody = [
            [WORK, 2],
            [CARRY, 1],
            [MOVE, 1],
          ];
        }

        Memory.TaskMan[spawnName].spawnList.push({
          role: "Builder",
          body: myBody,
        });
      }
      break;
    case 0:
      // Check if room storage energy is over 400k
      if (
        Game.spawns[spawnName].room.storage != undefined &&
        Game.spawns[spawnName].room.storage.store[RESOURCE_ENERGY] > 400000
      ) {
        Memory.TaskMan[spawnName].spawnList.push({
          role: "upCarrier",
          body: [
            [CARRY, 8],
            [MOVE, 4],
          ],
        });

        Memory.TaskMan[spawnName].spawnList.push({
          role: "Upgrader",
          body: [
            [WORK, 7],
            [CARRY, 1],
            [MOVE, 2],
          ],
        });
      }
      break;

    default:
      Memory.TaskMan[spawnName].spawnExtrasNumber = -1;
      return;
  }

  Memory.TaskMan[spawnName].spawnExtrasNumber++;
};

// module.exports.conditionalSpawnQue = conditionalSpawnQue;

/**
 * Generate spawn queue based on room's energy capacity phase
 * Phase 1: Up to 300 energy
 * Phase 2: 301-550 energy
 * Phase 3: 551+ energy
 */
function generatePhaseBasedSpawnQueue() {
  for (let spawnName in Game.spawns) {
    const spawn = Game.spawns[spawnName];
    const room = spawn.room;

    // Skip if spawn is busy or queue isn't empty
    if (spawn.spawning || Memory.TaskMan[spawnName].spawn.length > 0) continue;

    // Determine room phase based on energy capacity
    let phase = 1;
    if (room.energyCapacityAvailable > 550) {
      phase = 3;
    } else if (room.energyCapacityAvailable > 300) {
      phase = 2;
    }

    // Count creeps in this room
    const creepsInRoom = _.filter(
      Game.creeps,
      (c) => c.room.name === room.name
    );

    // Count by role
    const counts = {};
    for (let creep of creepsInRoom) {
      counts[creep.memory.role] = (counts[creep.memory.role] || 0) + 1;
    }

    // Get sources
    const sources = room.find(FIND_SOURCES);

    // Generate queue based on phase
    if (phase === 1) {
      generatePhase1Queue(spawn, spawnName, counts, sources);
    } else if (phase === 2) {
      generatePhase2Queue(spawn, spawnName, counts, sources);
    } else if (phase === 3) {
      generatePhase3Queue(spawn, spawnName, counts, sources);
    }
  }
}

/**
 * Phase 1 Queue (up to 300 energy)
 * Basic creeps with minimal parts
 */
function generatePhase1Queue(spawn, spawnName, counts, sources) {
  const room = spawn.room;

  // Miners: 1 per source with minimal parts
  const minersNeeded = sources.length;
  if (!counts.Miner || counts.Miner < minersNeeded) {
    const sourceIndex = counts.Miner || 0;
    if (sourceIndex < sources.length) {
      const source = sources[sourceIndex];
      const pos = findMiningPosition(source);

      Memory.TaskMan[spawnName].spawnList.push({
        role: "Miner",
        say: 1,
        atDest: false,
        sourceType: FIND_SOURCES,
        body: [
          [WORK, 2],
          [MOVE, 1],
        ],
        sitPOS: pos,
        sourceId: source.id,
      });
      return;
    }
  }

  // Carriers: 1 per source
  const carriersNeeded = sources.length;
  if (!counts.Carrier || counts.Carrier < carriersNeeded) {
    Memory.TaskMan[spawnName].spawnList.push({
      role: "Carrier",
      body: [
        [CARRY, 2],
        [MOVE, 2],
      ],
    });
    return;
  }

  // Basic upgrader
  if (!counts.Upgrader || counts.Upgrader < 1) {
    Memory.TaskMan[spawnName].spawnList.push({
      role: "Upgrader",
      body: [
        [WORK, 1],
        [CARRY, 1],
        [MOVE, 1],
      ],
    });
    return;
  }

  // Basic builder
  if (!counts.Builder || counts.Builder < 1) {
    Memory.TaskMan[spawnName].spawnList.push({
      role: "Builder",
      body: [
        [WORK, 1],
        [CARRY, 1],
        [MOVE, 1],
      ],
    });
    return;
  }
}

/**
 * Phase 2 Queue (301-550 energy)
 * More specialized creeps with better parts
 */
function generatePhase2Queue(spawn, spawnName, counts, sources) {
  const room = spawn.room;

  // Miners: 1 per source with more WORK parts
  const minersNeeded = sources.length;
  if (!counts.Miner || counts.Miner < minersNeeded) {
    const sourceIndex = counts.Miner || 0;
    if (sourceIndex < sources.length) {
      const source = sources[sourceIndex];
      const pos = findMiningPosition(source);

      Memory.TaskMan[spawnName].spawnList.push({
        role: "Miner",
        say: 1,
        atDest: false,
        sourceType: FIND_SOURCES,
        body: [
          [WORK, 3],
          [MOVE, 2],
        ],
        sitPOS: pos,
        sourceId: source.id,
      });
      return;
    }
  }

  // Carriers: 2 per source
  const carriersNeeded = sources.length * 2;
  if (!counts.Carrier || counts.Carrier < carriersNeeded) {
    Memory.TaskMan[spawnName].spawnList.push({
      role: "Carrier",
      body: [
        [CARRY, 3],
        [MOVE, 3],
      ],
    });
    return;
  }

  // Upgraders: 2
  const upgradersNeeded = 2;
  if (!counts.Upgrader || counts.Upgrader < upgradersNeeded) {
    Memory.TaskMan[spawnName].spawnList.push({
      role: "Upgrader",
      body: [
        [WORK, 2],
        [CARRY, 1],
        [MOVE, 2],
      ],
    });
    return;
  }

  // Builders: 1-2 based on construction sites
  let buildersNeeded = 1;
  const constructionSites = room.find(FIND_CONSTRUCTION_SITES);
  if (constructionSites.length > 3) {
    buildersNeeded = 2;
  }

  if (!counts.Builder || counts.Builder < buildersNeeded) {
    Memory.TaskMan[spawnName].spawnList.push({
      role: "Builder",
      body: [
        [WORK, 2],
        [CARRY, 2],
        [MOVE, 2],
      ],
    });
    return;
  }

  // Repairer: 1
  if (!counts.Repairer || counts.Repairer < 1) {
    Memory.TaskMan[spawnName].spawnList.push({
      role: "Repairer",
      body: [
        [WORK, 1],
        [CARRY, 2],
        [MOVE, 2],
      ],
    });
    return;
  }
}

/**
 * Phase 3 Queue (551+ energy)
 * Highly specialized creeps with optimal parts
 */
function generatePhase3Queue(spawn, spawnName, counts, sources) {
  const room = spawn.room;

  // Miners: 1 per source with optimized WORK parts
  const minersNeeded = sources.length;
  if (!counts.Miner || counts.Miner < minersNeeded) {
    const sourceIndex = counts.Miner || 0;
    if (sourceIndex < sources.length) {
      const source = sources[sourceIndex];
      const pos = findMiningPosition(source);

      Memory.TaskMan[spawnName].spawnList.push({
        role: "Miner",
        say: 1,
        atDest: false,
        sourceType: FIND_SOURCES,
        body: [
          [WORK, 5],
          [MOVE, 3],
        ],
        sitPOS: pos,
        sourceId: source.id,
      });
      return;
    }
  }

  // Carriers: 2 per source with higher capacity
  const carriersNeeded = sources.length * 2;
  if (!counts.Carrier || counts.Carrier < carriersNeeded) {
    Memory.TaskMan[spawnName].spawnList.push({
      role: "Carrier",
      body: [
        [CARRY, 6],
        [MOVE, 3],
      ],
    });
    return;
  }

  // Upgraders: 2-3 with high WORK
  const upgradersNeeded = room.controller.level >= 4 ? 3 : 2;
  if (!counts.Upgrader || counts.Upgrader < upgradersNeeded) {
    Memory.TaskMan[spawnName].spawnList.push({
      role: "Upgrader",
      body: [
        [WORK, 4],
        [CARRY, 2],
        [MOVE, 3],
      ],
    });
    return;
  }

  // Builders: 1-3 based on construction sites
  let buildersNeeded = 1;
  const constructionSites = room.find(FIND_CONSTRUCTION_SITES);
  if (constructionSites.length > 5) {
    buildersNeeded = 3;
  } else if (constructionSites.length > 2) {
    buildersNeeded = 2;
  }

  if (!counts.Builder || counts.Builder < buildersNeeded) {
    Memory.TaskMan[spawnName].spawnList.push({
      role: "Builder",
      body: [
        [WORK, 3],
        [CARRY, 3],
        [MOVE, 3],
      ],
    });
    return;
  }

  // Repairer: 1-2
  const repairersNeeded = 2;
  if (!counts.Repairer || counts.Repairer < repairersNeeded) {
    Memory.TaskMan[spawnName].spawnList.push({
      role: "Repairer",
      body: [
        [WORK, 2],
        [CARRY, 3],
        [MOVE, 3],
      ],
    });
    return;
  }

  // Special roles for Phase 3
  // Defender
  if ((!counts.Defender || counts.Defender < 1) && room.controller.level >= 3) {
    Memory.TaskMan[spawnName].spawnList.push({
      role: "Defender",
      body: [
        [ATTACK, 3],
        [TOUGH, 2],
        [MOVE, 5],
      ],
    });
    return;
  }

  // Dedicated hauler for controller upgrading
  if (
    (!counts.upCarrier || counts.upCarrier < 1) &&
    room.storage &&
    room.storage.store[RESOURCE_ENERGY] > 10000
  ) {
    Memory.TaskMan[spawnName].spawnList.push({
      role: "upCarrier",
      body: [
        [CARRY, 6],
        [MOVE, 3],
      ],
    });
    return;
  }
}

// Helper function to find mining position
function findMiningPosition(source) {
  // Implement logic to find a valid mining position near the source
  // Simplified version for now:
  return { x: source.pos.x, y: source.pos.y, roomName: source.pos.roomName };
}

// Export the functions
module.exports.generatePhaseBasedSpawnQueue = generatePhaseBasedSpawnQueue;
