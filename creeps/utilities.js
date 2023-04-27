var roleUtilities = {
  //
  //
  //
  sayState: function (creep, state, public) {
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
        break;
    }
    creep.say(emojiSay, public);
  },

  //
  //  Get
  //
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
  getEnergyContainer: function (creep, iNum) {
    var container = creep.room.find(FIND_STRUCTURES, {
      filter: (structure) => {
        return structure.structureType == STRUCTURE_CONTAINER;
      },
    });
    var iState = creep.withdraw(container[iNum], RESOURCE_ENERGY);
    if (iState == ERR_NOT_IN_RANGE) {
      creep.moveTo(container[iNum].pos, {
        visualizePathStyle: { stroke: "#00ffff" },
      });
      return true;
    } else if (iState == OK) {
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
          structure.store.getUsedCapacity < structure.store.getCapacity
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
          structure.store.getUsedCapacity < structure.store.getCapacity
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

  idle: function (creep) {
    creep.say("🍦 Idle", true);
    creep.moveTo(Game.flags.Flag1.pos, this.pathStyle);
  },
  doUpgrade: function (creep) {
    var iState = creep.upgradeController(creep.room.controller);
    if (iState == ERR_NOT_IN_RANGE) {
      creep.moveTo(creep.room.controller, this.pathStyle);
      return true;
    } else if (iState == OK) {
      creep.say("🌟 🔫 🦄", true);
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

module.exports.Utilities = roleUtilities;
