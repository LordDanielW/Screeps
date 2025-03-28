/**
 * Memory Initializer Module
 * Handles dynamic initialization of memory structures
 */
if (!module.exports) module.exports = {};

// Initialize Memory
//
function initMemory() {
  // Base memory initialization
  if (!Memory.TaskMan) Memory.TaskMan = {};
  if (!Memory.Tick) Memory.Tick = 0;
  if (!Memory.lastLoopFailed) Memory.lastLoopFailed = false;
  if (!Memory.TaskMan.NameNum) Memory.TaskMan.NameNum = 1;

  // Initialize for each room we control
  for (let roomName in Game.rooms) {
    const room = Game.rooms[roomName];
    if (!room.controller || !room.controller.my) continue;

    // Initialize basic room memory in TaskMan
    if (!Memory.TaskMan[roomName]) {
      Memory.TaskMan[roomName] = {
        sourceContainers: [],
        upgradeContainer: null,
        wallHealth: 100,
      };
    }

    // Find and set source containers
    if (Memory.TaskMan[roomName].sourceContainers.length === 0) {
      findSourceContainers(room);
    }

    // Find and set upgrade container
    if (!Memory.TaskMan[roomName].upgradeContainer) {
      findUpgradeContainer(room);
    }

    // Find and set links
    updateRoomLinks(room);
  }

  // Initialize spawn memory
  for (let spawnName in Game.spawns) {
    if (!Memory.TaskMan[spawnName]) {
      Memory.TaskMan[spawnName] = {
        spawn: [],
        spawnListNumber: -1,
        spawnExtrasNumber: -1,
      };
    }
  }

  // Verify the spawn memory queue exists
  for (let spawnName in Memory.TaskMan) {
    // If it's a spawn
    if (Game.spawns[spawnName]) {
      if (!Memory.TaskMan[spawnName].spawn) {
        Memory.TaskMan[spawnName].spawn = [];
      }
      if (Memory.TaskMan[spawnName].spawnListNumber === undefined) {
        Memory.TaskMan[spawnName].spawnListNumber = -1;
      }
      if (Memory.TaskMan[spawnName].spawnExtrasNumber === undefined) {
        Memory.TaskMan[spawnName].spawnExtrasNumber = -1;
      }
    }
  }
}

/**
 * Find containers near sources and add them to memory
 * @param {Room} room - The room to analyze
 */
function findSourceContainers(room) {
  const sources = room.find(FIND_SOURCES);
  const containers = room.find(FIND_STRUCTURES, {
    filter: (s) => s.structureType === STRUCTURE_CONTAINER,
  });

  if (containers.length === 0) return;

  // Find containers near sources
  for (let source of sources) {
    const nearbyContainers = source.pos.findInRange(containers, 2);

    for (let container of nearbyContainers) {
      if (!Memory.TaskMan[room.name].sourceContainers.includes(container.id)) {
        Memory.TaskMan[room.name].sourceContainers.push(container.id);
      }
    }
  }
}

/**
 * Find container near the controller and set it as the upgrade container
 * @param {Room} room - The room to analyze
 */
function findUpgradeContainer(room) {
  if (!room.controller) return;

  const containers = room.find(FIND_STRUCTURES, {
    filter: (s) => s.structureType === STRUCTURE_CONTAINER,
  });

  if (containers.length === 0) return;

  // Find container near controller
  const nearbyContainers = room.controller.pos.findInRange(containers, 3);

  if (nearbyContainers.length > 0) {
    Memory.TaskMan[room.name].upgradeContainer = nearbyContainers[0].id;
  }
}

/**
 * Update the link configuration for a room
 * @param {Room} room - The room to update
 */
function updateRoomLinks(room) {
  const links = room.find(FIND_STRUCTURES, {
    filter: (s) => s.structureType === STRUCTURE_LINK,
  });

  if (links.length < 2) return;

  // Find source links (near sources)
  const sources = room.find(FIND_SOURCES);
  let sourceLinks = [];

  for (let source of sources) {
    const nearLinks = source.pos.findInRange(links, 2);
    if (nearLinks.length > 0) {
      sourceLinks.push(nearLinks[0]);
    }
  }

  // Find controller link
  let controllerLink = null;
  if (room.controller) {
    const nearLinks = room.controller.pos.findInRange(links, 3);
    if (nearLinks.length > 0) {
      controllerLink = nearLinks[0];
    }
  }

  // Set the links in memory
  if (sourceLinks.length > 0 && controllerLink) {
    Memory.TaskMan[room.name].linkFrom = sourceLinks[0].id;
    Memory.TaskMan[room.name].linkTo = controllerLink.id;
  }
}

/**
 * Generate a default spawn queue if needed
 * This creates minimal creeps to keep the colony functioning
 */
function generateEmergencySpawnQueue() {
  for (let spawnName in Game.spawns) {
    const spawn = Game.spawns[spawnName];
    const room = spawn.room;

    // Skip if spawn is busy or queue isn't empty
    if (spawn.spawning || Memory.TaskMan[spawnName].spawn.length > 0) continue;

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

    // Generate emergency creeps if none exist
    if (creepsInRoom.length === 0) {
      console.log(
        `EMERGENCY: No creeps in ${room.name}. Spawning recovery miner and carrier.`
      );

      // Find a source
      const sources = room.find(FIND_SOURCES);
      if (sources.length === 0) continue;

      // Get position near source
      const source = sources[0];
      const pos = findMiningPosition(source);

      // Add a simple miner first
      Memory.TaskMan[spawnName].spawn.push({
        role: "Miner",
        say: 1,
        atDest: false,
        sourceType: FIND_SOURCES,
        body: [
          [WORK, 1],
          [MOVE, 1],
        ],
        sitPOS: pos,
      });

      // Add a simple carrier
      Memory.TaskMan[spawnName].spawn.push({
        role: "Carrier",
        body: [
          [CARRY, 1],
          [MOVE, 1],
        ],
      });

      continue;
    }

    // Make sure we have at least 1 miner
    if (!counts.Miner || counts.Miner < 1) {
      const sources = room.find(FIND_SOURCES);
      if (sources.length === 0) continue;

      const source = sources[0];
      const pos = findMiningPosition(source);

      Memory.TaskMan[spawnName].spawn.push({
        role: "Miner",
        say: 1,
        atDest: false,
        sourceType: FIND_SOURCES,
        body: [
          [WORK, 2],
          [MOVE, 1],
        ],
        sitPOS: pos,
      });

      continue;
    }

    // Make sure we have at least 1 carrier
    if (!counts.Carrier || counts.Carrier < 1) {
      Memory.TaskMan[spawnName].spawn.push({
        role: "Carrier",
        body: [
          [CARRY, 2],
          [MOVE, 1],
        ],
      });

      continue;
    }
  }
}

/**
 * Find a valid mining position near a source
 * @param {Source} source - The source to mine
 * @returns {Object} - {x, y, roomName} position
 */
function findMiningPosition(source) {
  const terrain = new Room.Terrain(source.room.name);

  // Check all positions around the source
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue;

      const x = source.pos.x + dx;
      const y = source.pos.y + dy;

      // Skip if outside room boundaries
      if (x < 1 || y < 1 || x > 48 || y > 48) continue;

      // Check if the position is walkable
      if (terrain.get(x, y) !== TERRAIN_MASK_WALL) {
        return { x, y, roomName: source.room.name };
      }
    }
  }

  // Fallback to source position if nothing else found
  return { x: source.pos.x, y: source.pos.y, roomName: source.room.name };
}

Object.assign(module.exports, {
  initMemory,
  generateEmergencySpawnQueue,
});
