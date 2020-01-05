var roleUpCarrier = require('role.upCarrier');
var roleCarrier = require('role.carrier');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleMiner = require('role.miner');
var roleLink = require('role.linker');

var modSpawn = {
  //  Spawn Creeps
  //
  //
  spawnCreeps: function () {
    if (Game.spawns['Spawn1'].spawning) {
      // Game.spawns['Spawn1'].room.visual.text(
      //   '🛠️' + "hello",
      //   Game.spawns['Spawn1'].pos.x + 1,
      //   Game.spawns['Spawn1'].pos.y,
      //   { align: 'left', opacity: 0.8 });

      var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
      Game.spawns['Spawn1'].room.visual.text(
        '🛠️' + spawningCreep.memory.role,
        Game.spawns['Spawn1'].pos.x + 1,
        Game.spawns['Spawn1'].pos.y,
        { align: 'left', opacity: 0.8 });
    } else if (false) { //Memory.TaskMan.spawn.queue != "none") {
      switch (Memory.TaskMan.spawn.queue[0]) {
        case 'carrier':
          var newName = 'carrier' + Game.time;
          Game.spawns['Spawn1'].spawnCreep(roleCarrier.build, newName, { memory: { role: 'carrier', task: 'reap' } });
          break;
        case 'miner':
          var newName = 'Miner' + Game.time;
          Game.spawns['Spawn1'].spawnCreep(roleMiner.build, newName, { memory: { role: 'miner', dest: new RoomPosition(13, 8, "W17N38") } });
          break;
      }
      Memory.TaskMan.spawn.queue[0] = "none";
    } else {
      var linker = _.filter(Game.creeps, (creep) => creep.memory.role == 'linker');
      // var upCarriers = _.filter(Game.creeps, (creep) => creep.memory.role == 'upCarrier');
      var carriers = _.filter(Game.creeps, (creep) => creep.memory.role == 'carrier');
      var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
      var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
      var miners = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner');
      var linker2 = _.filter(Game.creeps, (creep) => creep.memory.role == 'linker2');
      var miners3 = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner3');
      var linker3 = _.filter(Game.creeps, (creep) => creep.memory.role == 'linker3');
      if (carriers.length < 1) {
        var newName = 'carrier' + Game.time;
        Game.spawns['Spawn1'].spawnCreep(roleCarrier.build, newName,
          { memory: { role: 'carrier', task: 'reap' } });
        // } else if (upCarriers.length < 0) {
        //   var newName = 'upCarrier' + Game.time;
        //   Game.spawns['Spawn1'].spawnCreep(roleUpCarrier.build, newName,
        //     { memory: { role: 'upCarrier' } });
      } else if (linker.length < 1) {
        var newName = 'linker' + Game.time;
        Game.spawns['Spawn1'].spawnCreep(roleLink.build, newName,
          { memory: { role: 'linker', task: 'reap' } });
      } else if (miners.length < 1) {
        var newName = 'Miner' + Game.time;
        Game.spawns['Spawn1'].spawnCreep(roleMiner.build, newName,
          { memory: { role: 'miner' } });
      } else if (upgraders.length < 2) {
        var newName = 'Upgrader' + Game.time;
        Game.spawns['Spawn1'].spawnCreep(roleUpgrader.build, newName,
          { memory: { role: 'upgrader' } });
      } else if (builders.length < 1) {
        var newName = 'Builder' + Game.time;
        Game.spawns['Spawn1'].spawnCreep(roleBuilder.build, newName,
          { memory: { role: 'builder' } });
      } else if (linker2.length < 2) {
        var newName = 'linker2' + Game.time;
        Game.spawns['Spawn1'].spawnCreep(roleLink.build2, newName,
          { memory: { role: 'linker2', task: 'reap' } });
      } else if (miners3.length < 1) {
        var newName = 'Miner3' + Game.time;
        Game.spawns['Spawn1'].spawnCreep(roleMiner.build3, newName,
          { memory: { role: 'miner3' } });
      } else if (linker3.length < 1) {
        var newName = 'Linker3' + Game.time;
        Game.spawns['Spawn1'].spawnCreep(roleLink.build3, newName,
          { memory: { role: 'linker3', task: 'reap' } });
      }
      // } else if( Game.spawns['Spawn1'].){
      //link 2 > 750
      // }
    }
  }
}

module.exports = modSpawn;