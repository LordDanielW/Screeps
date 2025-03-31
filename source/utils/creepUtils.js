var creepAction = {
  //
  //
  //
  sayState: function (creep, state, public) {
    if (!global.showGraphics) {
      return;
    }
    let emojiSay = "❓❔❕❗";
    switch (state) {
      case "MOVE":
        emojiSay = "🍄🦽";
        break;
      case "GET":
        emojiSay = "🔋⚡";
        break;
      case "GIVE":
        emojiSay = "🦑 🪄";
        break;
      case "MINE":
        emojiSay = "⛏️";
        break;
      case "BUILD":
        emojiSay = "🚧 🛠️";
        break;
      case "BREAK":
        emojiSay = "⛏️ ⛏️";
        break;
      case "HEAL":
        emojiSay = "🧙 PEW ✨";
        break;
      case "WORK":
        emojiSay = "👩🏼‍🚀";
        break;
      case "UPGRADE":
        emojiSay = "✨ 🔫 🦄";
        break;
      case "IDLE":
        emojiSay = "🍦";
        break;
      case "ERROR":
        emojiSay = "🎊";
        break;
      default:
        emojiSay = "defaulting";
        // console.log(state);
        break;
    }
    creep.say(emojiSay, public);
  },

  //
  //  Move to
  //
  moveTo: function (creep, target) {
    if (creep.fatigue > 0) {
      return ERR_TIRED;
    }

    var response = creep.moveTo(target, {
      visualizePathStyle: { stroke: "#ffffff" },
      ignoreCreeps: false,
    });
    if (response != OK) {
      creep.say("🚧" + response + "🚧");
      creep.moveTo(target, {
        visualizePathStyle: { stroke: "#ff0066" },
        ignoreCreeps: true,
      });
    }
    return response;
  },

  //
  //  Get
  //
  getResourceById: function (creep, id, resourceType) {
    resourceType = resourceType || RESOURCE_ENERGY;
    var source = Game.getObjectById(id);
    var iState = creep.withdraw(source, resourceType);
    if (iState == ERR_NOT_IN_RANGE) {
      this.moveTo(creep, source.pos);
      return true;
    } else if (iState == OK) {
      return true;
    } else {
      iState = creep.pickup(source);
      if (iState == ERR_NOT_IN_RANGE) {
        this.moveTo(creep, source.pos);
        return true;
      } else if (iState == OK) {
        return true;
      } else {
        return false;
      }
    }
  },

  getEnergyLink: function (creep, iNum) {
    var enLink = creep.room.find(FIND_STRUCTURES, {
      filter: (structure) => {
        return structure.structureType == STRUCTURE_LINK;
      },
    });
    var iState = creep.withdraw(enLink[iNum], RESOURCE_ENERGY);
    if (iState == ERR_NOT_IN_RANGE) {
      this.moveTo(creep, enLink[iNum].pos);
      return true;
    } else if (iState == OK) {
      return true;
    } else {
      return false;
    }
  },

  //
  //  GET RESOURCE
  //
  getResource: function (creep, resourceType) {
    resourceType = resourceType || RESOURCE_ENERGY;

    // Selected Destination from Memory
    let fullSource = Game.getObjectById(creep.memory.source);

    // If no destination, find one
    if (fullSource == null && creep.memory.tryforSource == false) {
      creep.memory.tryforSource = true;
      this.findFullSource(creep, resourceType);
      this.getResource(creep, resourceType);
      return true;
    } else if (fullSource == null && creep.memory.tryforSource == true) {
      creep.memory.tryforSource = false;
      return false;
    }
    creep.memory.tryforSource = false;

    // Get Resource
    let response;
    if (creep.memory.sourceType == "DROPPED_RESOURCES") {
      response = creep.pickup(fullSource);
    } else {
      response = creep.withdraw(fullSource, RESOURCE_ENERGY);
    }

    // Move to Resource
    if (response == ERR_NOT_IN_RANGE) {
      this.moveTo(creep, fullSource);
    } else if (response == OK) {
      // Do nothing
    } else if (response == ERR_NOT_ENOUGH_RESOURCES) {
      this.findFullSource(creep, resourceType);
    } else {
      // console.log(creep.role + " Get ERROR: " + response);
    }

    // if showgraphics, saystate response
    if (showGraphics) {
      this.sayState(creep, response);
    }
  },

  //  Find Full Source
  //
  findFullSource: function (creep, resourceType) {
    creep.memory.task = "GET";
    let fullSource = null;
    resourceType = resourceType || RESOURCE_ENERGY;

    // If not Carrier, try pull from storage first
    if (creep.memory.role != "Carrier") {
      if (
        creep.room.storage &&
        creep.room.storage.store.getUsedCapacity([resourceType]) >=
          creep.store.getFreeCapacity([resourceType])
      ) {
        fullSource = creep.room.storage;
        creep.memory.source = fullSource.id;
        creep.memory.sourceType = "STORAGE";
        return true;
      }
    }

    // Check Tombstones
    fullSource = creep.pos.findClosestByRange(FIND_TOMBSTONES, {
      filter: (tomb) => {
        return tomb.creep.store[resourceType] >= creep.store.getFreeCapacity();
      },
    });
    if (fullSource) {
      creep.memory.source = fullSource.id;
      creep.memory.sourceType = "TOMBSTONES";
      return true;
    }

    // Check Dropped
    fullSource = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {
      filter: (dropped) => {
        return dropped.amount >= creep.store.getFreeCapacity();
      },
    });
    if (fullSource) {
      creep.memory.source = fullSource.id;
      creep.memory.sourceType = "DROPPED_RESOURCES";
      return true;
    }

    // Check Room Sources
    let t = Memory.TaskMan[creep.room.name].sourceContainers;
    let roomSources = [];
    for (let i = 0; t && i < t.length; i++) {
      let sourceContainer = Game.getObjectById(t[i]);
      if (
        sourceContainer &&
        sourceContainer.store[resourceType] >= creep.store.getFreeCapacity()
      ) {
        roomSources.push(sourceContainer);
      }
    }
    fullSource = creep.pos.findClosestByRange(roomSources);
    if (fullSource) {
      creep.memory.source = fullSource.id;
      creep.memory.sourceType = "SOURCES";
      return true;
    }

    // Return The Storage
    if (
      creep.room.storage &&
      creep.room.storage.store.getUsedCapacity() > creep.store.getFreeCapacity()
    ) {
      creep.memory.source = creep.room.storage.id;
      creep.memory.sourceType = "STORAGE";
      return true;
    }

    // Check Any Container
    fullSource = creep.pos.findClosestByRange(FIND_STRUCTURES, {
      filter: (structure) => {
        return (
          structure.structureType == STRUCTURE_CONTAINER &&
          structure.store[resourceType] >= creep.store.getFreeCapacity()
        );
      },
    });
    if (fullSource) {
      creep.memory.source = fullSource.id;
      creep.memory.sourceType = "CONTAINER";
      return true;
    }

    // If no source found, return false
    // console.log(creep.name + " - No Source Found. Type: " + resourceType);
    creep.memory.source = null;
    return false;
  },

  // TODO: implement for resource types other than energy
  emptyCarry: function (creep) {
    creep.moveTo(creep.room.storage);
    for (const resourceType in creep.carry) {
      creep.transfer(creep.room.storage, resourceType);
    }
    if (creep.getUsedCapacity != null) {
      return false;
    } else {
      return true;
    }
  },

  doUpgrade: function (creep) {
    var iState = creep.upgradeController(creep.room.controller);

    //To Danny: You can actually do some actions concurrently (specifically, pick up energy and upgrade can happen in same tick).
    //obv shouldnt be here, but ya, put it where u want it. *This works from withdraw from container and transfering between creeps as well (see the chart i opened on other screen)
    //u could do it every tick if u wanted but it does cost 0.2 cpu (so upgrading and transfering in same tick allows a single creep to take 0.4 cpu)
    //I just did it at range 1 cause it is free if any energy is lying next to upgrader (as in your new room)
    if (creep.store.getUsedCapacity() < creep.store.getCapacity() / 2) {
      let nearDrops = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 1, {
        filter: { resourceType: RESOURCE_ENERGY },
      });
      if (nearDrops.length > 0) {
        creep.pickup(nearDrops[0]);
      }
    }

    if (iState == ERR_NOT_IN_RANGE) {
      creep.moveTo(creep.room.controller, this.pathStyle);
      return true;
    } else if (iState == OK) {
      // creep.say("🌟 🔫 🦄", true);
      return true;
    } else {
      return false;
    }
  },

  signIt: function (creep) {
    if (creep.room.controller) {
      if (
        creep.signController(creep.room.controller, "Welcome to Amerika") ==
        ERR_NOT_IN_RANGE
      ) {
        this.moveTo(creep, creep.room.controller);
      }
    }
  },

  findOptimalMiningPosition: function (creep) {
    if (!creep.memory.sourceType) {
      creep.memory.sourceType = FIND_SOURCES;
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
};

module.exports.action = creepAction;
