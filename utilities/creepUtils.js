var roleUtilities = {
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
  //  Get
  //
  getEnergyFromID: function (creep, id) {
    var source = Game.getObjectById(id);
    var iState = creep.withdraw(source, RESOURCE_ENERGY);
    if (iState == ERR_NOT_IN_RANGE) {
      creep.moveTo(source.pos, this.pathStyle);
      return true;
    } else if (iState == OK) {
      return true;
    } else {
      return false;
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
      creep.moveTo(enLink[iNum].pos, this.pathStyle);
      return true;
    } else if (iState == OK) {
      return true;
    } else {
      return false;
    }
  },
  getEnergyStorage: function (creep) {
    // Could be done more efficient by Room.storage
    var storage = creep.room.storage; //.find(FIND_STRUCTURES, { filter: (structure) => { return (structure.structureType == STRUCTURE_STORAGE); } });
    var iState = creep.withdraw(storage, RESOURCE_ENERGY);
    if (iState == ERR_NOT_IN_RANGE) {
      creep.moveTo(storage.pos, this.pathStyle);
      return true;
    } else if (iState == OK) {
      return true;
    } else {
      return false;
    }
  },
  getEnergyContainer: function (creep) {
    let iNum = creep.memory.iStore;
    if (!iNum) {
      creep.memory.iStore = 0;
    }
    var container = creep.room.find(FIND_STRUCTURES, {
      filter: (structure) => {
        return (
          structure.structureType == STRUCTURE_CONTAINER &&
          structure.store[RESOURCE_ENERGY] > creep.store.getCapacity()
        );
      },
    });
    var iState = creep.withdraw(container[iNum], RESOURCE_ENERGY);
    if (iState == ERR_NOT_IN_RANGE) {
      creep.moveTo(container[iNum].pos, {
        visualizePathStyle: { stroke: "#00ffff" },
      });
      return true;
    } else if (iState == OK) {
      if (iNum == 2) {
        //  Do Nothing
      }
      if (iNum == 0) {
        creep.memory.iStore = 1;
      } else if (iNum == 1) {
        creep.memory.iStore = 0;
      }
      return true;
    } else {
      return false;
    }
  },
  getEnergy: function (creep) {
    var container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: (d) => {
        return (
          d.structureType == STRUCTURE_CONTAINER &&
          d.store[RESOURCE_ENERGY] > creep.store.getCapacity()
        );
      },
    });
    if (container) {
      // && containers[0].energry > 50) {
      var iState = creep.withdraw(container, RESOURCE_ENERGY);
      if (iState == ERR_NOT_IN_RANGE) {
        creep.moveTo(container.pos, this.pathStyle);
        return true;
      } else if (iState == OK) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  },
  getEnergyFactory: function (creep) {
    var factory = creep.room.find(FIND_STRUCTURES, {
      filter: (d) => {
        return d.structureType == STRUCTURE_FACTORY;
      },
    });
    if (creep.withdraw(factory[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
      creep.moveTo(factory[0], this.pathStyle);
    }
  },
  checkTombstones: function (creep) {
    var dropped = creep.pos.findClosestByPath(FIND_TOMBSTONES, {
      filter: (tomb) => {
        return tomb.creep.store >= creep.carryCapacity;
      },
    });
    if (dropped) {
      var iState = creep.withdraw(dropped, RESOURCE_ENERGY);
      if (iState == ERR_NOT_IN_RANGE) {
        creep.moveTo(dropped.pos, this.pathStyle);
        return true;
      } else if (iState == OK) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  },
  getEnergyHarvest: function (creep) {
    var dropenergy = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
      filter: (d) => {
        return (
          d.resourceType == RESOURCE_ENERGY && d.amount > creep.carryCapacity
        );
      },
    });
    var iState = creep.pickup(dropenergy);
    if (dropenergy && iState == ERR_NOT_IN_RANGE) {
      creep.moveTo(dropenergy, this.pathStyle);
      return true;
    } else {
      this.getEnergy(creep);
    }
  },

  //
  //  Give
  //
  giveSpawner: function (creep) {
    let state = "NONE";
    let emptySpawners = creep.room.find(FIND_STRUCTURES, {
      filter: (structure) => {
        return (
          (structure.structureType == STRUCTURE_EXTENSION ||
            structure.structureType == STRUCTURE_SPAWN) &&
          structure.store.getUsedCapacity(RESOURCE_ENERGY) <
            structure.store.getCapacity(RESOURCE_ENERGY)
        );
      },
    });

    if (emptySpawners.length > 0) {
      let emptySpawn = creep.pos.findClosestByPath(emptySpawners);
      let response = creep.transfer(emptySpawn, RESOURCE_ENERGY);
      if (response == ERR_NOT_IN_RANGE) {
        creep.moveTo(emptySpawn, this.pathStyle);
        state = "MOVE";
      } else if (response == OK) {
        state = "GIVE";
      } else {
        state = "ERROR";
      }
    }
    return state;
  },

  giveTower: function (creep) {
    let state = "NONE";
    let emptyTowers = creep.room.find(FIND_STRUCTURES, {
      filter: (structure) => {
        return (
          structure.structureType == STRUCTURE_TOWER &&
          structure.store.getUsedCapacity(RESOURCE_ENERGY) <
            structure.store.getCapacity(RESOURCE_ENERGY)
        );
      },
    });
    if (emptyTowers.length > 0) {
      let emptyTower = creep.pos.findClosestByPath(emptyTowers);
      if (creep.transfer(emptyTower, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(emptyTower, { visualizePathStyle: { stroke: "#ffffff" } });
      }
    }
  },

  giveContainer: function (creep) {},

  //
  //
  //
  pathStyle: { visualizePathStyle: { stroke: "#ffffff" } },

  transferResponse: function (creep, position, response) {},

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
        creep.moveTo(creep.room.controller);
      }
    }
  },
};

module.exports.roleUtilities = roleUtilities;
