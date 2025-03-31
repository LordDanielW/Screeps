//  Run Spawn Queue
//
function runSpawnQueue(room) {
  /**
   * Generate spawn queue based on room's energy capacity phase
   * Phase 1: Up to 300 energy
   * Phase 2: 301-550 energy
   * Phase 3: 551+ energy
   */
  for (let spawnName in Game.spawns) {
    const spawn = Game.spawns[spawnName];
    const room = spawn.room;

    // Determine room phase based on energy capacity
    let phase = 1;
    if (room.energyCapacityAvailable > 550) {
      phase = 3;
    } else if (room.energyCapacityAvailable > 300) {
      phase = 2;
    }

    // Generate queue based on phase
    if (phase === 1) {
      generatePhase1Queue(room);
    } else if (phase === 2) {
      generatePhase2Queue(room);
    } else if (phase === 3) {
      generatePhase3Queue(room);
    }
  }
}

exports.runSpawnQueue = runSpawnQueue;

/**
 * Phase 1 Queue (up to 300 energy)
 * Basic creeps with minimal parts
 */
function generatePhase1Queue(spawn) {
  console.log("Generating Phase 1 Queue for " + spawn.name);
  const room = spawn.room;

  // Get sources
  const sources = room.find(FIND_SOURCES);

  // Miners: 1 per source with minimal parts
  const minersNeeded = sources.length;
  if (!counts.Miner || counts.Miner < minersNeeded) {
    const sourceIndex = counts.Miner || 0;
    if (sourceIndex < sources.length) {
      const source = sources[sourceIndex];
      const pos = findMiningPosition(source, spawn);

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
  console.log("Generating Phase 2 Queue for " + spawn.name);
  const room = spawn.room;

  // Miners: 1 per source with more WORK parts
  const minersNeeded = sources.length;
  if (!counts.Miner || counts.Miner < minersNeeded) {
    const sourceIndex = counts.Miner || 0;
    if (sourceIndex < sources.length) {
      const source = sources[sourceIndex];
      const pos = findMiningPosition(source, spawn);

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

  // Repair: 1
  if (!counts.Repair || counts.Repair < 1) {
    Memory.TaskMan[spawnName].spawnList.push({
      role: "Repair",
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
  console.log("Generating Phase 3 Queue for " + spawn.name);
  const room = spawn.room;

  // Miners: 1 per source with optimized WORK parts
  const minersNeeded = sources.length;
  if (!counts.Miner || counts.Miner < minersNeeded) {
    const sourceIndex = counts.Miner || 0;
    if (sourceIndex < sources.length) {
      const source = sources[sourceIndex];
      const pos = findMiningPosition(source, spawn);

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

  // Repair: 1-2
  const RepairsNeeded = 2;
  if (!counts.Repair || counts.Repair < RepairsNeeded) {
    Memory.TaskMan[spawnName].spawnList.push({
      role: "Repair",
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

//  Find Mining Position
//
function findMiningPosition(source, spawn) {
  // First check for containers near the source
  const containers = source.pos.findInRange(FIND_STRUCTURES, 1, {
    filter: (s) => s.structureType === STRUCTURE_CONTAINER,
  });

  if (containers.length > 0) {
    // If there are containers, choose the closest one to spawn
    let closestContainer = containers[0];
    let minDistance = spawn.pos.getRangeTo(closestContainer.pos);

    for (let container of containers) {
      const distance = spawn.pos.getRangeTo(container.pos);
      if (distance < minDistance) {
        minDistance = distance;
        closestContainer = container;
      }
    }

    return {
      x: closestContainer.pos.x,
      y: closestContainer.pos.y,
      roomName: closestContainer.pos.roomName,
    };
  }

  // If no containers, find the closest open terrain spot around source
  const terrain = Game.map.getRoomTerrain(source.room.name);
  let bestPos = null;
  let minDistance = Infinity;

  // Check the 8 surrounding tiles
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue; // Skip the source's own position

      const x = source.pos.x + dx;
      const y = source.pos.y + dy;

      // Check if the position is walkable
      if (terrain.get(x, y) !== TERRAIN_MASK_WALL) {
        const pos = new RoomPosition(x, y, source.room.name);

        // Calculate distance to spawn
        const distance = spawn.pos.getRangeTo(pos);

        // If this position is closer than the previous best, update it
        if (distance < minDistance) {
          minDistance = distance;
          bestPos = {
            x: x,
            y: y,
            roomName: source.room.name,
          };
        }
      }
    }
  }

  // Return the best position found, or null if none found
  if (bestPos) {
    return bestPos;
  }

  // Fallback: if all positions are occupied, just return any valid position
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue;

      const x = source.pos.x + dx;
      const y = source.pos.y + dy;

      if (terrain.get(x, y) !== TERRAIN_MASK_WALL) {
        return {
          x: x,
          y: y,
          roomName: source.room.name,
        };
      }
    }
  }
}
