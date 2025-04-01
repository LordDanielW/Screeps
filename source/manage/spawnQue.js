//  Run Spawn Queue
//
function runSpawnQueue(roomName) {
  const room = Game.rooms[roomName];
  /**
   * Generate spawn queue based on room's energy capacity phase
   * Phase 1: Up to 300 energy
   * Phase 2: 301-550 energy
   * Phase 3: 551-800 energy
   */

  // Determine room phase based on energy capacity
  let phase = 1;
  if (room.energyCapacityAvailable > 550) {
    phase = 3;
  } else if (room.energyCapacityAvailable > 300) {
    phase = 2;
  }

  // Generate queue based on phase
  if (phase === 1) {
    generatePhase1Queue(roomName);
  } else if (phase === 2) {
    generatePhase2Queue(roomName);
  } else if (phase === 3) {
    generatePhase3Queue(roomName);
  }
}

exports.runSpawnQueue = runSpawnQueue;

/**
 * Phase 1 Queue (up to 300 energy)
 * Basic creeps with minimal parts
 */
function generatePhase1Queue(roomName) {
  const room = Game.rooms[roomName];
  console.log("Generating Phase" + 1 + "Queue for " + room.name);
  // TODO: fix when multiple spawns
  const spawn = room.find(FIND_MY_SPAWNS)[0];
  const spawnName = spawn.name;

  // Get sources
  const sources = room.find(FIND_SOURCES);
  const numSources = sources.length;

  // Miners: 1 per source with minimal parts
  if (!counts.Miner || counts.Miner < numSources) {
    const sourceIndex = counts.Miner || 0;
    if (sourceIndex < sources.length) {
      const source = sources[sourceIndex];
      const pos = findMiningPosition(source, spawn);

      Memory.TaskMan[spawnName].spawnList.push({
        role: "Miner",
        say: 1,
        atDest: false,
        sourceType: FIND_SOURCES,
        sourceId: source.id,
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
  if (!counts.Carrier || counts.Carrier < numSources) {
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
function generatePhase2Queue(room) {
  console.log("Generating Phase 2 Queue for " + room.name);
  // TODO: fix when multiple spawns
  const spawn = room.find(FIND_MY_SPAWNS)[0];
  const spawnName = spawn.name;

  // Get sources
  const sources = room.find(FIND_SOURCES);
  const numSources = sources.length;

  // Miners: 1 per source
  for (let i = 0; i < numSources; i++) {
    const source = sources[i];
    const pos = findMiningPosition(source, spawn);

    Memory.TaskMan[spawnName].spawnList.push({
      role: "Miner",
      say: 1,
      atDest: false,
      sourceType: FIND_SOURCES,
      sourceId: source.id,
      body: [
        [WORK, 3],
        [MOVE, 2],
      ],
      sitPOS: pos,
      sourceId: source.id,
    });
  }

  // Carriers: 2 per source
  for (let i = 0; i < numSources; i++) {
    Memory.TaskMan[spawnName].spawnList.push({
      role: "Carrier",
      body: [
        [CARRY, 3],
        [MOVE, 3],
      ],
    });
  }

  // Upgraders: 2 per source
  for (let i = 0; i < numSources * 2; i++) {
    Memory.TaskMan[spawnName].spawnList.push({
      role: "Upgrader",
      body: [
        [WORK, 2],
        [CARRY, 1],
        [MOVE, 2],
      ],
    });
  }

  // Builders: 1
  const constructionSites = room.find(FIND_CONSTRUCTION_SITES);
  if (constructionSites.length != 0) {
    Memory.TaskMan[spawnName].spawnList.push({
      role: "Builder",
      body: [
        [WORK, 2],
        [CARRY, 2],
        [MOVE, 2],
      ],
    });
  }

  // Repair: 1
  Memory.TaskMan[spawnName].spawnList.push({
    role: "Repair",
    body: [
      [WORK, 1],
      [CARRY, 2],
      [MOVE, 2],
    ],
  });
}

/**
 * Phase 3 Queue (551+ energy)
 * Highly specialized creeps with optimal parts
 */
function generatePhase3Queue(roomName) {
  const room = Game.rooms[roomName];
  console.log("Generating Phase 3 Queue for " + room.name);
  // TODO: fix when multiple spawns
  const spawn = room.find(FIND_MY_SPAWNS)[0];
  const spawnName = spawn.name;

  // Get sources
  const sources = room.find(FIND_SOURCES);
  const numSources = sources.length;

  // Miners
  for (let i = 0; i < numSources; i++) {
    const source = sources[i];
    const pos = findMiningPosition(source, spawn);

    Memory.TaskMan[spawnName].spawnList.push({
      role: "Miner",
      say: 1,
      atDest: false,
      sourceType: RESOURCE_ENERGY,
      sourceId: source.id,
      body: [
        [WORK, 5],
        [MOVE, 1],
      ],
      sitPOS: pos,
    });
  }

  // Carriers
  for (let i = 0; i < 1; i++) {
    Memory.TaskMan[spawnName].spawnList.push({
      role: "Carrier",
      body: [
        [CARRY, 3],
        [MOVE, 3],
      ],
    });
  }

  // upCarrier
  for (let i = 0; i < 2; i++) {
    Memory.TaskMan[spawnName].spawnList.push({
      role: "upCarrier",
      body: [
        [CARRY, 5],
        [MOVE, 3],
      ],
    });
  }

  // Upgraders
  for (let i = 0; i < 3; i++) {
    Memory.TaskMan[spawnName].spawnList.push({
      role: "Upgrader",
      body: [
        [WORK, 4],
        [CARRY, 1],
        [MOVE, 1],
      ],
    });
  }

  // Builders
  const constructionSites = room.find(FIND_CONSTRUCTION_SITES);
  if (constructionSites.length != 0) {
    Memory.TaskMan[spawnName].spawnList.push({
      role: "Builder",
      body: [
        [WORK, 2],
        [CARRY, 2],
        [MOVE, 2],
      ],
    });
  }

  // Repair
  for (let i = 0; i < 2; i++) {
    Memory.TaskMan[spawnName].spawnList.push({
      role: "Repair",
      body: [
        [WORK, 1],
        [CARRY, 2],
        [MOVE, 2],
      ],
    });
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
