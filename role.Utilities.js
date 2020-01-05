var roleUtilities = {
  getEnergyLink: function (creep, iNum) {
    var enLink = creep.room.find(FIND_STRUCTURES, { filter: (structure) => { return (structure.structureType == STRUCTURE_LINK); } });
    var iState = creep.withdraw(enLink[iNum], RESOURCE_ENERGY);
    if (iState == ERR_NOT_IN_RANGE) {
      creep.moveTo(enLink[iNum].pos, { visualizePathStyle: { stroke: '#00ffff' } });
      return true;
    } else if (iState == OK) {
      return true;
    } else {
      return false;
    }
  },
  getEnergyStorage: function (creep) { // Could be done more efficient by Room.storage
    var storage = creep.room.find(FIND_STRUCTURES, { filter: (structure) => { return (structure.structureType == STRUCTURE_STORAGE); } });
    var iState = creep.withdraw(storage[0], RESOURCE_ENERGY);
    if (iState == ERR_NOT_IN_RANGE) {
      creep.moveTo(storage[0].pos, { visualizePathStyle: { stroke: '#00ffff' } });
      return true;
    } else if (iState == OK) {
      return true;
    } else {
      return false;
    }
  },
  getEnergyContainer: function (creep, iNum) {
    var container = creep.room.find(FIND_STRUCTURES, { filter: (structure) => { return (structure.structureType == STRUCTURE_CONTAINER); } });
    var iState = creep.withdraw(container[iNum], RESOURCE_ENERGY)
    if (iState == ERR_NOT_IN_RANGE) {
      creep.moveTo(container[iNum].pos, { visualizePathStyle: { stroke: '#00ffff' } });
      return true;
    } else if (iState == OK) {
      return true;
    } else {
      return false;
    }
  },
  getEnergy: function (creep) {
    var containers = creep.room.find(FIND_STRUCTURES, { filter: (structure) => { return (structure.structureType == STRUCTURE_CONTAINER); } });
    if (containers.length > 0) {// && containers[0].energry > 50) {
      var iState = creep.withdraw(containers[0], RESOURCE_ENERGY)
      if (iState == ERR_NOT_IN_RANGE) {
        creep.moveTo(containers[0].pos, { visualizePathStyle: { stroke: '#00cc00' } });
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
  checkTombstones: function (creep) {
    var dropped = creep.pos.findClosestByPath(FIND_TOMBSTONES, { filter: (tomb) => { return (tomb.creep.store >= 50) } });
    if (dropped) {
      var iState = creep.withdraw(dropped, RESOURCE_ENERGY);
      if (iState == ERR_NOT_IN_RANGE) {
        creep.moveTo(dropped.pos, { visualizePathStyle: { stroke: '#ffff66' } });
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
      filter: (d) => { return (d.resourceType == RESOURCE_ENERGY && d.amount > 50) }
    });
    var iState = creep.pickup(dropenergy);
    if (dropenergy && iState == ERR_NOT_IN_RANGE) {
      creep.moveTo(dropenergy, { visualizePathStyle: { stroke: '#0066ff' } });
      return true;
    } else {
      this.getEnergy(creep);
    }
  },
  timeToDie: function (creep) {
    creep.moveTo(Game.flags.Flag1.pos, { visualizePathStyle: { stroke: '#ffffff' } });
  },
  idle: function (creep) {
    creep.say('🍦 Idle', true);
    creep.moveTo(Game.flags.Flag1.pos, { visualizePathStyle: { stroke: '#ff00ff' } });
  },
  doUpgrade: function (creep) {
    var iState = creep.upgradeController(creep.room.controller);
    if (iState == ERR_NOT_IN_RANGE) {
      creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ff0000' } });
      return true;
    } else if (iState == OK) {
      return true;
    } else {
      return false;
    }
  }
};

module.exports = roleUtilities;