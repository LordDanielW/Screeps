/**
 * Memory Utilities
 * Helper functions for memory inspection and manipulation
 */

// Global functions for console use
global.inspect = function (path) {
  if (!path) {
    return _.pick(Memory, ["TaskMan", "Tick", "lastLoopFailed"]);
  }

  const parts = path.split(".");
  let current = Memory;

  for (const part of parts) {
    if (current[part] === undefined) {
      return `Path ${path} not found in Memory`;
    }
    current = current[part];
  }

  return current;
};

global.resetSpawnQueues = function () {
  for (const spawnName in Game.spawns) {
    if (!Memory.TaskMan[spawnName]) {
      Memory.TaskMan[spawnName] = {};
    }

    Memory.TaskMan[spawnName].spawn = [];
    Memory.TaskMan[spawnName].spawnListNumber = -1;
    Memory.TaskMan[spawnName].spawnExtrasNumber = -1;

    console.log(`Reset spawn queue for ${spawnName}`);
  }
  return "Spawn queues reset";
};

global.resetTaskMan = function () {
  Memory.TaskMan = {
    Tick: 0,
    NameNum: 1,
    breakList: [],
  };

  for (const spawnName in Game.spawns) {
    Memory.TaskMan[spawnName] = {
      spawn: [],
      spawnListNumber: -1,
      spawnExtrasNumber: -1,
    };
  }

  for (const roomName in Game.rooms) {
    if (Game.rooms[roomName].controller && Game.rooms[roomName].controller.my) {
      Memory.TaskMan[roomName] = {
        sourceContainers: [],
        upgradeContainer: null,
        wallHealth: 100,
      };
    }
  }

  return "TaskMan reset. Run memory.init.initMemory() to repopulate.";
};

global.fixMemory = function () {
  const memInit = require("memory.init");
  memInit.initMemory();
  return "Memory initialized";
};

global.createEmergencyCreeps = function () {
  const memInit = require("memory.init");
  memInit.generateEmergencySpawnQueue();
  return "Emergency creeps queued for spawning";
};

global.countRoles = function () {
  // Count creeps by role
  const counts = {};
  for (const name in Game.creeps) {
    const role = Game.creeps[name].memory.role;
    counts[role] = (counts[role] || 0) + 1;
  }

  // Display counts by room
  const roomCounts = {};
  for (const name in Game.creeps) {
    const creep = Game.creeps[name];
    const roomName = creep.room.name;

    if (!roomCounts[roomName]) {
      roomCounts[roomName] = {};
    }

    const role = creep.memory.role;
    roomCounts[roomName][role] = (roomCounts[roomName][role] || 0) + 1;
  }

  return {
    total: counts,
    byRoom: roomCounts,
  };
};

// Add a basic creep to the spawn queue
global.addCreep = function (spawnName, role) {
  if (!Game.spawns[spawnName]) {
    return `Spawn ${spawnName} not found`;
  }

  if (!Memory.TaskMan[spawnName]) {
    Memory.TaskMan[spawnName] = {
      spawn: [],
      spawnListNumber: -1,
      spawnExtrasNumber: -1,
    };
  }

  let body = [
    [WORK, 1],
    [CARRY, 1],
    [MOVE, 1],
  ];

  switch (role) {
    case "Miner":
      body = [
        [WORK, 2],
        [MOVE, 1],
      ];

      // Find a source position
      const room = Game.spawns[spawnName].room;
      const sources = room.find(FIND_SOURCES);
      if (sources.length === 0) {
        return "No sources found in room";
      }

      const source = sources[0];
      const pos = findMiningPosition(source);

      Memory.TaskMan[spawnName].spawn.push({
        role: "Miner",
        say: 1,
        atDest: false,
        sourceType: FIND_SOURCES,
        body: body,
        sitPOS: pos,
      });
      break;

    case "Carrier":
      body = [
        [CARRY, 2],
        [MOVE, 1],
      ];
      Memory.TaskMan[spawnName].spawn.push({
        role: "Carrier",
        body: body,
      });
      break;

    case "Upgrader":
      body = [
        [WORK, 2],
        [CARRY, 1],
        [MOVE, 1],
      ];
      Memory.TaskMan[spawnName].spawn.push({
        role: "Upgrader",
        body: body,
      });
      break;

    case "Builder":
      body = [
        [WORK, 1],
        [CARRY, 1],
        [MOVE, 1],
      ];
      Memory.TaskMan[spawnName].spawn.push({
        role: "Builder",
        body: body,
      });
      break;

    case "Repair":
      body = [
        [WORK, 1],
        [CARRY, 1],
        [MOVE, 1],
      ];
      Memory.TaskMan[spawnName].spawn.push({
        role: "Repair",
        body: body,
      });
      break;

    default:
      return `Unknown role: ${role}`;
  }

  return `Added ${role} to ${spawnName} spawn queue`;
};

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
