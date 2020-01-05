var modTower = {
  /** @param {Tower} tower **/
  run: function (tower) {
    var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
      //filter: (creep) => (creep.name.includes("invader"))
    });
    if (closestHostile && tower.pos.getRangeTo(closestHostile) < 8) {
      tower.attack(closestHostile);
    }else{
      var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (structure) => structure.hits < (structure.hitsMax - 2000 )&& structure.structureType != STRUCTURE_WALL && structure.structureType != STRUCTURE_RAMPART
      });
      if (closestDamagedStructure && tower.pos.getRangeTo(closestDamagedStructure) < 21 ) {
        tower.repair(closestDamagedStructure);
      } else{
        var rampUpgrade = tower.pos.findClosestByRange(FIND_STRUCTURES, {
          filter: (structure) => (structure.structureType == STRUCTURE_RAMPART && structure.hits < 25000)
        });
        if (rampUpgrade && tower.pos.getRangeTo(rampUpgrade) < 12) {
          tower.repair(rampUpgrade);
        } else{
          // var closestDamagedCreep = tower.pos.findClosestByRange(FIND_CREEPS, {
          //   filter: (creep) => (creep.body.length > creep.getActiveBodyparts)
          // })
        }
      }
    }
  }
  
//        Game.rooms.W17N38.controller.activateSafeMode();

};
module.exports = modTower;
