var roleMiner = {
  /** @param {Creep} creep **/
  run: function (creep) {
    if (!creep.memory.sourceType) {
      creep.memory.sourceType = FIND_SOURCES;
    }
    //creep.memory.sitPOS = new RoomPosition(37, 36, "E46N33");
    if (creep.memory.atDest) {
      var source = Game.getObjectById(creep.memory.source);
      var error = creep.harvest(source);
      if (error != OK) {
        // creep.say("Nope");
        // Memory.Foo = error;
        // creep.memory.atDest = false;
      }
      if (global.showGraphics) {
        this.sing(creep);
      }
    } else {
      if (!creep.memory.sitPOS) {
        this.findOptimalMiningPosition(creep);
      }
      var mPOS = creep.memory.sitPOS;
      var sitPOS = new RoomPosition(mPOS.x, mPOS.y, mPOS.roomName);
      if (creep.pos.isEqualTo(sitPOS)) {
        var SourceID = creep.pos.findClosestByRange(creep.memory.sourceType);
        //, {filter: (source) => source.energy > 0 });
        if (SourceID) {
          creep.memory.atDest = true;
          creep.memory.source = SourceID.id;
        }
      } else {
        utils.role.moveTo(creep, sitPOS);
      }
    }
  },

  /**
   * Find the best mining position - preferably on a container near a source
   * @param {Creep} creep
   */
  findOptimalMiningPosition: function (creep) {
    if (!creep.memory.sourceType) {
      creep.memory.sourceType = RESOURCE_ENERGY;
    }
    const sources = creep.room.find(creep.memory.sourceType);
    if (!sources.length) return;

    // Try to find sources with containers nearby
    for (let source of sources) {
      // Find containers within 1 tile of the source
      const containers = source.pos.findInRange(FIND_STRUCTURES, 1, {
        filter: (s) => s.structureType === STRUCTURE_CONTAINER,
      });

      // Check if any container positions are available (not occupied by other miners)
      for (let container of containers) {
        // Check if position is occupied
        const creepsAtPos = container.pos.lookFor(LOOK_CREEPS);
        if (creepsAtPos.length === 0 || creepsAtPos[0].id === creep.id) {
          // Found an available container position
          creep.memory.sitPOS = {
            x: container.pos.x,
            y: container.pos.y,
            roomName: container.pos.roomName,
          };
          return;
        }
      }
    }

    // If no containers found or all occupied, find an available position adjacent to a source
    for (let source of sources) {
      const terrain = Game.map.getRoomTerrain(source.room.name);

      // Check the 8 surrounding tiles
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          if (dx === 0 && dy === 0) continue; // Skip the source's own position

          const x = source.pos.x + dx;
          const y = source.pos.y + dy;

          // Check if the position is walkable and not occupied
          if (terrain.get(x, y) !== TERRAIN_MASK_WALL) {
            const pos = new RoomPosition(x, y, source.room.name);
            const creepsAtPos = pos.lookFor(LOOK_CREEPS);

            if (creepsAtPos.length === 0 || creepsAtPos[0].id === creep.id) {
              creep.memory.sitPOS = {
                x: x,
                y: y,
                roomName: source.room.name,
              };
              return;
            }
          }
        }
      }
    }
  },

  /**
   * Makes the creep say lines from a set of lyrics
   * @param {Creep} creep
   * @param {Object} lyricSet - The set of lyrics to use
   */
  sing: function (creep, lyricSet = LYRICS.rammstein) {
    if (!creep.memory.sayIndex) {
      creep.memory.sayIndex = 0;
    }

    if (creep.memory.sayIndex >= lyricSet.lines.length) {
      creep.memory.sayIndex = lyricSet.loop ? lyricSet.loopIndex || 0 : 0;
    }

    creep.say(lyricSet.lines[creep.memory.sayIndex], true);
    creep.memory.sayIndex++;
  },
};

// Global lyrics object
global.LYRICS = {
  rammstein: {
    name: "Du Hast",
    lines: ["du!", "du hast!", "du hast -", "mich!", " 💥  💣 💥 "],
    loop: true,
    loopIndex: 0,
  },
  vitas: {
    name: "Chum Drum Bedrum",
    lines: [
      "Ya prishol",
      "daty etu",
      "piesnyu",
      "Ya prishol",
      "daty etu",
      "piesnyu",
      "Iz mira",
      "gryoz",
      "chum drum",
      "bedrum",
    ],
    loop: true,
    loopIndex: 0,
  },
};

module.exports.Miner = roleMiner;
