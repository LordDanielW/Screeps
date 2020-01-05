var roles = {};
//roles.Roles = require('role.roles');
roles.Defender = require('role.defender');
roles.Carrier = require('role.carrier');
roles.Upgrader = require('role.upgrader');
roles.Builder = require('role.builder');
roles.Signer = require('role.signer');
roles.Miner = require('role.miner');
roles.Linker = require('role.linker');
roles.Repair = require('role.repair');
var modTower = require('mod.tower');
roles.Utilities = require('role.Utilities');

module.exports.loop = function () {

  //  Ticks
  //
  var Tick = Memory.TaskMan.Tick;
  Memory.TaskMan.Tick++;
  if (Memory.TaskMan.Tick >= 1440) {
    Memory.TaskMan.Tick = 0;
    if (Memory.TaskMan.NameNum >= 100) {
      Memory.TaskMan.NameNum = 1;
    }
  }
  doTicks(Tick);
  garbageCollect();
  var myRoomOne = Game.rooms.E46N33;
  //var myRoomTwo = Game.rooms.W16N39;

  //  Towers
  //
  // var towers = myRoomOne.find(FIND_STRUCTURES, {
  //   filter: (structure) => { return structure.structureType == STRUCTURE_TOWER; }
  // });
  // var moTowers = myRoomTwo.find(FIND_STRUCTURES, {
  //   filter: (structure) => { return structure.structureType == STRUCTURE_TOWER; }
  // });
  // try {
  //   for (var i = 0; i < towers.length; i++) {
  //     modTower.run(towers[i]);
  //     displayAttackRings(myRoomOne, towers[i]);
  //   }
  //   for (var i = 0; i < moTowers.length; i++) {
  //     modTower.run(moTowers[i]);
  //     displayAttackRings(myRoomTwo, moTowers[i]);
  //   }
  // } catch (e) {
  //   console.log("Tower Fail");
  //   console.log(e);
  // }

  //  Screep Run Loop
  //
  for (var name in Game.creeps) {
    var creep = Game.creeps[name];

    try {
      roles[creep.memory.role].run(creep);
    } catch (e) {
      creep.say("㊙︎ HELP!", true);
      //creep.memory.role = "Repair";
      console.log("Creep Fail");
      console.log(e);
    }
  }

  //  Linker Transfer
  //
  // var linkers = myRoomOne.find(FIND_STRUCTURES, {
  //   filter: (structure) => { return (structure.structureType == STRUCTURE_LINK); }
  // });
  // var error = linkers[0].transferEnergy(linkers[1]);

  try {
    spawnCreeps(myRoomOne);
    //spawnCreeps2(myRoomTwo);
  } catch (e) {
    console.log("Spawn Fail");
    console.log(e);
    Memory.TaskMan.E46N33.spawn.shift();
    //Memory.TaskMan.W16N39.spawn.shift();
  }
  // Memory.TaskMan.W17N38.spawn.queue.shift();
  // Memory.TaskMan.W16N39.spawn.queue.shift();
  //  console.log("tick message");
}
//  *****************************  //
//         END Main Loop           //
//  *****************************  //

//  Spawn Creeps
//
//
function spawnCreeps(theRoom) {
  if (Memory.TaskMan.E46N33.spawn.length > 5) {
    Memory.TaskMan.E46N33.spawn = [];
    Memory.TaskMan.E46N33.spawn.push({ Carrier: { memory: { role: "Carrier", task: "get", spawn: "Vat1" } } });
  }
  if (Game.spawns['Vat1'].spawning) {
    var spawningCreep = Game.creeps[Game.spawns['Vat1'].spawning.name];
    theRoom.visual.text(
      '🛠️' + spawningCreep.memory.role,
      Game.spawns['Vat1'].pos.x + 1,
      Game.spawns['Vat1'].pos.y,
      { align: 'left', opacity: 0.8 });
  } else if (Memory.TaskMan.E46N33.spawn.length != 0) {
    var Role = Memory.TaskMan.E46N33.spawn[0]
    var roleKey = Object.keys(Role)
    //Memory.Foo = roleKey[0];
    if (roles[roleKey[0]].build(Role[roleKey[0]]) == OK) {
      Memory.TaskMan.E46N33.spawn.shift();
    }
  } else {
    var countRoles = {};
    for (var name in Game.creeps) {
      var role = Game.creeps[name].memory.role
      if (countRoles[role] == null) {
        countRoles[role] = 1;
      } else {
        countRoles[role]++;
      }
    }
    if (countRoles.Carrier == undefined || countRoles.Carrier < 1) {
      Memory.TaskMan.E46N33.spawn.push({ "Carrier": { memory: { role: "Carrier", task: "get", spawn: "Vat1" } } });
    } else if (countRoles.Miner == undefined || countRoles.Miner < 1) {
      Memory.TaskMan.E46N33.spawn.push({ Miner: { memory: { role: 'Miner', say: 1, atDest: false, body: "body1", sitPOS: { x: 26, y: 20, roomName: "E46N33" }, spawn: "Vat1" } } });
    }    
  }
}
function spawnCreeps2(theRoom) {
  if (Memory.TaskMan.E46N33.spawn.length > 5) {
    Memory.TaskMan.E46N33.spawn = [];
    Memory.TaskMan.E46N33.spawn.push({ Carrier: { memory: { role: "Carrier", task: "get", spawn: "Vat1" } } });
  }
  if (Game.spawns['Spawn1'].spawning) {
    var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
    theRoom.visual.text(
      '🛠️' + spawningCreep.memory.role,
      Game.spawns['Spawn1'].pos.x + 1,
      Game.spawns['Spawn1'].pos.y,
      { align: 'left', opacity: 0.8 });
  } else if (Memory.TaskMan.W16N39.spawn.queue.length > 0) {
    var Role = Memory.TaskMan.W16N39.spawn.queue[0]
    var roleKey = Object.keys(Role)
    if (roles[roleKey[0]].build(Role[roleKey[0]]) == OK) {
      Memory.TaskMan.W16N39.spawn.queue.shift();
    }
  }
}


//  Garbage Collect
//
//
function garbageCollect() {
  for (var name in Memory.creeps) {
    if (!Game.creeps[name]) {
      delete Memory.creeps[name];
    }
  }
}

//  Do Ticks
//
//
function doTicks(ticks) {
  switch (ticks) {
    case 1:
      Memory.TaskMan.E46N33.spawn.push({ Carrier: { memory: { role: "Carrier", task: "get", spawn: "Vat1" } } });
      break;
    case 250:
      Memory.TaskMan.E46N33.spawn.push({
        Miner: {
          memory: {
            role: 'Miner', say: 1, atDest: false, body: "body1", sitPOS: { x: 26, y: 20, roomName: "E46N33" }, spawn: "Vat1"
          }
        }
      });    
      break;
    case 350:
     Memory.TaskMan.E46N33.spawn.push({ Upgrader: { memory: { role: "Upgrader", body: "body1", source: 2, spawn: "Vat1" } } });
     break;
    case 400:
      Memory.TaskMan.E46N33.spawn.push({
          Miner: {
            memory: {
              role: 'Miner', say: 6, atDest: false, body: "body1", sitPOS: { x: 43, y: 26, roomName: "E46N33" }, spawn: "Vat1"
            }
          }
        });        
      break;
    case 500:
      Memory.TaskMan.E46N33.spawn.push({
        Builder: {
          memory: {
            role: 'Builder', task:'get', spawn:"Vat1"
          }
        }
      });
      break;
    case 550:
      Memory.TaskMan.E46N33.spawn.push({ "Repair": { memory: { role: "Repair", task: "get", spawn: "Vat1" } } });
      break;
    case 850:
        // Memory.TaskMan.W17N38.spawn.queue.push({
        //    Linker: { 
        //      memory: { 
        //        role: "Linker", "run": 3, getPOS: { x: 43, y: 34, roomName: "W16N38" }, 
        //        givePOS: { x: 17, y: 8, roomName: "W17N38" }, spawn: "BabyCakes",  body: "body3", task:"reap"}
        //       } 
        //     });
        // Memory.TaskMan.W16N39.spawn.queue.push({ Carrier: { memory: { role: "Carrier", task: "get", spawn: "Spawn1" } } });
      break;
  }
}


displayAttackRings = function (aRoom, aTower) {
  aRoom.visual.circle(aTower.pos.x, aTower.pos.y, {
    fill: 'transparent',
    stroke: 'red',
    strokeWidth: .1,
    radius: 5
  });
  aRoom.visual.circle(aTower.pos.x, aTower.pos.y, {
    fill: 'transparent',
    stroke: 'yellow',
    strokeWidth: .1,
    radius: 10
  });
  return aRoom.visual.circle(aTower.pos.x, aTower.pos.y, {
    fill: 'transparent',
    stroke: 'blue',
    strokeWidth: .1,
    radius: 20
  });
}