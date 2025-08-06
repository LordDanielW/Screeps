//  Run Spawn Queue
//
function runSpawnQueue(roomName) {
  const room = Game.rooms[roomName];
  /**
   * Generate spawn queue based on room's energy capacity phase
   * Phase 1: Up to 300 energy
   * Phase 2: 301-550 energy
   * Phase 3: 551-800 energy
   * Phase 4: 801+ energy
   */

  // Determine room phase based on energy capacity
  let phase = 1;
  if (room.energyCapacityAvailable > 800) {
    phase = 4;
    generatePhaseQueue(roomName, 4);
  } else if (room.energyCapacityAvailable > 550) {
    phase = 3;
    generatePhaseQueue(roomName, 3);
  } else if (room.energyCapacityAvailable > 300) {
    phase = 2;
    generatePhaseQueue(roomName, 2);
  } else {
    phase = 1;
    generatePhaseQueue(roomName, 1);
  }
}

exports.runSpawnQueue = runSpawnQueue;

/**
 * Body part configurations by role and phase
 */
const bodyConfigs = {
  Miner: {
    1: [
      [WORK, 2],
      [MOVE, 1],
    ],
    2: [
      [WORK, 3],
      [MOVE, 2],
    ],
    3: [
      [WORK, 5],
      [MOVE, 1],
    ],
    4: [
      [WORK, 6],
      [MOVE, 2],
    ],
  },
  Carrier: {
    1: [
      [CARRY, 2],
      [MOVE, 2],
    ],
    2: [
      [CARRY, 3],
      [MOVE, 3],
    ],
    3: [
      [CARRY, 3],
      [MOVE, 3],
    ],
    4: [
      [CARRY, 4],
      [MOVE, 4],
    ],
  },
  upCarrier: {
    3: [
      [CARRY, 5],
      [MOVE, 3],
    ],
    4: [
      [CARRY, 6],
      [MOVE, 4],
    ],
  },
  Upgrader: {
    1: [
      [WORK, 1],
      [CARRY, 1],
      [MOVE, 1],
    ],
    2: [
      [WORK, 2],
      [CARRY, 1],
      [MOVE, 2],
    ],
    3: [
      [WORK, 4],
      [CARRY, 1],
      [MOVE, 1],
    ],
    4: [
      [WORK, 6],
      [CARRY, 2],
      [MOVE, 2],
    ],
  },
  Builder: {
    1: [
      [WORK, 1],
      [CARRY, 1],
      [MOVE, 1],
    ],
    2: [
      [WORK, 2],
      [CARRY, 2],
      [MOVE, 2],
    ],
    3: [
      [WORK, 2],
      [CARRY, 2],
      [MOVE, 2],
    ],
    4: [
      [WORK, 3],
      [CARRY, 3],
      [MOVE, 3],
    ],
  },
  Repair: {
    2: [
      [WORK, 1],
      [CARRY, 2],
      [MOVE, 2],
    ],
    3: [
      [WORK, 1],
      [CARRY, 2],
      [MOVE, 2],
    ],
    4: [
      [WORK, 2],
      [CARRY, 3],
      [MOVE, 3],
    ],
  },
};

/**
 * Role counts by phase and conditions
 */
function getRoleRequirements(room, phase) {
  const sources = room.find(FIND_SOURCES);
  const numSources = sources.length;
  let numBuilders = 0;
  if (room.find(FIND_CONSTRUCTION_SITES).length > 0) {
    numBuilders = 1;
  }

  // Define role counts for each phase
  const requirements = {
    1: {
      Carrier: numSources,
      Miner: numSources,
      Upgrader: 1,
      Builder: numBuilders,
    },
    2: {
      Carrier: numSources * 2,
      Miner: numSources,
      Upgrader: numSources * 2,
      Builder: numBuilders,
      Repair: 1,
    },
    3: {
      Carrier: 1,
      Miner: numSources,
      upCarrier: numSources,
      Upgrader: 3,
      Builder: numBuilders,
      Repair: 1,
    },
    4: {
      Carrier: 2,
      Miner: numSources,
      upCarrier: 1,
      Upgrader: 1,
      Builder: numBuilders,
      Repair: 1,
    },
  };

  if (requirements[phase]) {
    return requirements[phase];
  } else {
    return {};
  }
}

/**
 * Generate spawn queue based on room phase
 */
function generatePhaseQueue(roomName, phase) {
  const room = Game.rooms[roomName];
  console.log(`Generating Phase ${phase} Queue for ${room.name}`);

  const spawn = room.find(FIND_MY_SPAWNS)[0];
  if (!spawn) {
    console.log("No spawn found in room " + roomName);
    return;
  }
  Memory.TaskMan[spawn.name].spawnList = [];

  const spawnName = spawn.name;

  // Get sources
  const sources = room.find(FIND_SOURCES);

  // Get role requirements for this phase
  const roleRequirements = getRoleRequirements(room, phase);

  // Process each role
  Object.keys(roleRequirements).forEach((role) => {
    const count = roleRequirements[role];

    // For miners, we need to handle their special requirements
    if (role === "Miner") {
      for (let i = 0; i < count; i++) {
        if (i < sources.length) {
          const source = sources[i];
          const pos = findMiningPosition(source, spawn);

          Memory.TaskMan[spawnName].spawnList.push({
            role: "Miner",
            say: 1,
            atDest: false,
            sourceType: RESOURCE_ENERGY,
            body: bodyConfigs.Miner[phase],
            sitPOS: pos,
            sourceId: source.id,
          });
        }
      }
    }
    // For upCarrier, we need to assign sources
    else if (role === "upCarrier") {
      for (let i = 0; i < count; i++) {
        const sourceIndex = i % sources.length;
        const sourceId = Memory.TaskMan[roomName].sourceContainers[sourceIndex];
        Memory.TaskMan[spawnName].spawnList.push({
          role: "upCarrier",
          sourceId: sourceId,
          body: bodyConfigs.upCarrier[phase],
        });
      }
    }
    // For other roles, just add them to the queue
    else {
      for (let i = 0; i < count; i++) {
        Memory.TaskMan[spawnName].spawnList.push({
          role: role,
          body: bodyConfigs[role][phase],
        });
      }
    }
  });
}

// Run Claim Queue
//
function runClaimQueue(roomName, claimRoom) {
  const room = Game.rooms[roomName];
  const spawn = room.find(FIND_MY_SPAWNS)[0];
  if (!spawn) {
    console.log("No spawn found in room " + roomName);
    return;
  }

  const spawnName = spawn.name;
  Memory.TaskMan[spawnName].spawnList =
    Memory.TaskMan[spawnName].spawnList || [];

  // Define roles to spawn
  const claimRoles = ["Builder", "Miner", "Signer", "Upgrader"];

  // Iterate over each role and add to spawn queue
  claimRoles.forEach((role) => {
    Memory.TaskMan[spawnName].spawnList.push({
      role: role,
      task: "MOVIN",
      body: bodyConfigs[role][1], // Use phase 1 body configuration
      targetRoom: claimRoom, // Assign the claimRoom as the target
    });
  });

  console.log(`Claim queue generated for ${claimRoom} from ${roomName}`);
}

exports.runClaimQueue = runClaimQueue;

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
