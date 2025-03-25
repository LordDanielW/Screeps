module.exports = {
  // Construction timeline based on ticks
  timeline: [
    { tick: 100, structure: STRUCTURE_CONTAINER, count: 1, near: "source" },
    { tick: 500, structure: STRUCTURE_EXTENSION, count: 1 },
    { tick: 800, structure: STRUCTURE_EXTENSION, count: 1 },
    { tick: 1200, structure: STRUCTURE_EXTENSION, count: 1 },
    { tick: 1600, structure: STRUCTURE_EXTENSION, count: 1 },
    { tick: 2000, structure: STRUCTURE_EXTENSION, count: 1 },
    {
      tick: 2400,
      structure: STRUCTURE_ROAD,
      count: 5,
      path: "source-to-spawn",
    },
    { tick: 3000, structure: STRUCTURE_EXTENSION, count: 1 },
    // Additional structures as needed for RCL progress
  ],

  check: function (room) {
    const runtime = Game.time - Memory.speedRun.startTick;

    // Check each timeline entry
    for (const entry of this.timeline) {
      const id = `${entry.structure}-${entry.tick}`;

      // If we've reached this tick and haven't built this yet
      if (
        runtime >= entry.tick &&
        !Memory.speedRun.construction.completed[id]
      ) {
        this.placeStructure(room, entry);
        Memory.speedRun.construction.completed[id] = true;
      }
    }
  },

  placeStructure: function (room, entry) {
    switch (entry.structure) {
      case STRUCTURE_CONTAINER:
        this.placeContainer(room, entry);
        break;
      case STRUCTURE_EXTENSION:
        this.placeExtension(room, entry);
        break;
      case STRUCTURE_ROAD:
        this.placeRoads(room, entry);
        break;
      // Add other structure types as needed
    }
  },

  placeContainer: function (room, entry) {
    if (entry.near === "source") {
      const sources = room.find(FIND_SOURCES);
      // Place container next to the first source
      const source = sources[0];
      const terrain = room.getTerrain();

      // Find a spot adjacent to the source
      for (let x = source.pos.x - 1; x <= source.pos.x + 1; x++) {
        for (let y = source.pos.y - 1; y <= source.pos.y + 1; y++) {
          if (x === source.pos.x && y === source.pos.y) continue;

          // Check if this position is walkable
          if (terrain.get(x, y) !== TERRAIN_MASK_WALL) {
            room.createConstructionSite(x, y, STRUCTURE_CONTAINER);
            return;
          }
        }
      }
    }
  },

  placeExtension: function (room, entry) {
    const spawn = room.find(FIND_MY_SPAWNS)[0];
    if (!spawn) return;

    // Find a valid spot for an extension in a spiral pattern around spawn
    const spiralRadius = 3;

    for (let radius = 2; radius <= spiralRadius; radius++) {
      for (let dx = -radius; dx <= radius; dx++) {
        for (let dy = -radius; dy <= radius; dy++) {
          // Skip the corners to make it more circular
          if (Math.abs(dx) === radius && Math.abs(dy) === radius) continue;

          const x = spawn.pos.x + dx;
          const y = spawn.pos.y + dy;

          // Check if this position is valid and not occupied
          if (this.canBuildHere(room, x, y, STRUCTURE_EXTENSION)) {
            room.createConstructionSite(x, y, STRUCTURE_EXTENSION);
            return;
          }
        }
      }
    }
  },

  placeRoads: function (room, entry) {
    if (entry.path === "source-to-spawn") {
      const spawn = room.find(FIND_MY_SPAWNS)[0];
      const sources = room.find(FIND_SOURCES);

      // Build roads from spawn to each source
      for (const source of sources) {
        const path = room.findPath(spawn.pos, source.pos, {
          ignoreCreeps: true,
          swampCost: 2,
        });

        // Place road construction sites along the path
        for (const pos of path) {
          room.createConstructionSite(pos.x, pos.y, STRUCTURE_ROAD);
        }
      }
    }
  },

  canBuildHere: function (room, x, y, structureType) {
    // Check if coordinates are in bounds
    if (x < 0 || y < 0 || x > 49 || y > 49) return false;

    // Check terrain
    if (room.getTerrain().get(x, y) === TERRAIN_MASK_WALL) return false;

    // Check for existing structures or construction sites
    const look = room.lookAt(x, y);
    for (const item of look) {
      if (item.type === "structure" || item.type === "constructionSite") {
        return false;
      }
    }

    return true;
  },
};
