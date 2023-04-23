var roles = require("creeps.all");
// roles.Defender = require("creeps.defender");
// roles.Carrier = require("creeps.carrier");
// roles.upCarrier = require("creeps.upCarrier");
// roles.Upgrader = require("creeps.upgrader");
// roles.Builder = require("creeps.builder");
// roles.Signer = require("creeps.signer");
// roles.Miner = require("creeps.miner");
// roles.Linker = require("creeps.linker");
// roles.Repair = require("creeps.repair");
// roles.Lab = require("creeps.lab");
var structures = require("structures.all");
// roles.Utilities = require("creeps.utilities");

module.exports.loop = function () {
  //  Ticks
  //
  var Tick = Memory.TaskMan.Tick;
  Memory.TaskMan.Tick++;
  if (Memory.TaskMan.Tick >= 1460) {
    Memory.TaskMan.Tick = 0;
    if (Memory.TaskMan.NameNum >= 100) {
      Memory.TaskMan.NameNum = 1;
    }
  }
  doTicks(Tick);
  garbageCollect();
  var myRoomOne = Game.rooms.E9N52;
  //var myRoomTwo = Game.rooms.W16N39;

  //  Towers
  //
  var towers = myRoomOne.find(FIND_STRUCTURES, {
    filter: (structure) => {
      return structure.structureType == STRUCTURE_TOWER;
    },
  });
  // var moTowers = myRoomTwo.find(FIND_STRUCTURES, {
  //   filter: (structure) => { return structure.structureType == STRUCTURE_TOWER; }
  // });
  try {
    for (var i = 0; i < towers.length; i++) {
      structures.Tower.run(towers[i]);
      displayAttackRings(myRoomOne, towers[i]);
    }
    //  for (var i = 0; i < moTowers.length; i++) {
    //   structures.Tower.run(moTowers[i]);
    //   displayAttackRings(myRoomTwo, moTowers[i]);
    //  }
  } catch (e) {
    console.log("Tower Fail");
    console.log(e);
  }

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
  //   var linkers = myRoomOne.find(FIND_STRUCTURES, {
  //      filter: (structure) => { return (structure.structureType == STRUCTURE_LINK); }
  //   });
  //   var error = linkers[0].transferEnergy(linkers[1]);
  //   var error2 = linkers[2].transferEnergy(linkers[1]);

  //   Factory
  //
  //   var factory = myRoomOne.find(FIND_STRUCTURES, {
  //      filter: (structure) => { return (structure.structureType == STRUCTURE_FACTORY); }
  //   })[0];
  //   //Memory.Foo = factory.store[RESOURCE_LEMERGIUM] ;
  //   if(factory.cooldown == 0)
  //   {
  //       factory.produce(RESOURCE_LEMERGIUM_BAR);
  //     //   if(factory.store.energy == null || factory.store.energy < 5000){
  //     //     factory.produce(RESOURCE_ENERGY);
  //     //   } else{
  //     //     factory.produce(RESOURCE_LEMERGIUM_BAR);
  //     //   }
  //   }

  try {
    spawnCreeps(myRoomOne);
    //spawnCreeps2(myRoomTwo);
  } catch (e) {
    console.log("Spawn Fail");
    console.log(e);
    Memory.TaskMan.E9N52.spawn.shift();
    //Memory.TaskMan.W16N39.spawn.shift();
  }
  // Memory.TaskMan.W17N38.spawn.queue.shift();
  // Memory.TaskMan.W16N39.spawn.queue.shift();
  //  console.log("tick message");
};
//  *****************************  //
//         END Main Loop           //
//  *****************************  //

//Memory.TaskMan.E46N33.spawn.push({ upCarrier: { memory: { role: "upCarrier", task: "reap", iStore:1, body: "body1", spawn: "Vat2" } } });
// Memory.TaskMan.E46N33.spawn.push({ Lab: { memory: { role: "Lab", task: "getTask", spawn: "Vat1", body: "body1" } } });

//  Spawn Creeps
//
//
function spawnCreeps(theRoom) {
  var roomName = theRoom.name;
  var spawnName = "Spawn1";
  if (Memory.TaskMan[roomName].spawn.length > 5) {
    Memory.TaskMan[roomName].spawn = [];
    Memory.TaskMan[roomName].spawn.push({
      Carrier: {
        memory: { role: "Carrier", task: "get", iStore: 1, spawn: spawnName },
      },
    });
  }
  if (Game.spawns[spawnName].spawning) {
    var spawningCreep = Game.creeps[Game.spawns[spawnName].spawning.name];
    theRoom.visual.text(
      "🛠️" + spawningCreep.memory.role,
      Game.spawns[spawnName].pos.x + 1,
      Game.spawns[spawnName].pos.y,
      { align: "left", opacity: 0.8 }
    );
  } else if (Memory.TaskMan[roomName].spawn.length != 0) {
    var Role = Memory.TaskMan[roomName].spawn[0];
    var roleKey = Object.keys(Role);
    //Memory.Foo = roleKey[0];
    if (roles[roleKey[0]].build(Role[roleKey[0]]) == OK) {
      Memory.TaskMan[roomName].spawn.shift();
    }
  } else {
    var countRoles = {};
    for (var name in Game.creeps) {
      var role = Game.creeps[name].memory.role;
      if (countRoles[role] == null) {
        countRoles[role] = 1;
      } else {
        countRoles[role]++;
      }
    }
    if (countRoles.Carrier == undefined || countRoles.Carrier < 1) {
      Memory.TaskMan[roomName].spawn.push({
        Carrier: {
          memory: { role: "Carrier", task: "get", iStore: 1, spawn: spawnName },
        },
      });
    } else if (countRoles.Miner == undefined || countRoles.Miner < 1) {
      Memory.TaskMan[roomName].spawn.push({
        Miner: {
          memory: {
            role: "Miner",
            say: 1,
            atDest: false,
            body: "body1",
            sourceType: FIND_SOURCES,
            sitPOS: { x: 15, y: 31, roomName: roomName },
            spawn: spawnName,
          },
        },
      });
    }
  }
}
function spawnCreeps2(theRoom) {
  if (Memory.TaskMan[roomName].spawn.length > 5) {
    Memory.TaskMan[roomName].spawn = [];
    Memory.TaskMan[roomName].spawn.push({
      Carrier: {
        memory: { role: "Carrier", task: "get", iStore: 1, spawn: "Vat1" },
      },
    });
  }
  if (Game.spawns["Spawn1"].spawning) {
    var spawningCreep = Game.creeps[Game.spawns["Spawn1"].spawning.name];
    theRoom.visual.text(
      "🛠️" + spawningCreep.memory.role,
      Game.spawns["Spawn1"].pos.x + 1,
      Game.spawns["Spawn1"].pos.y,
      { align: "left", opacity: 0.8 }
    );
  } else if (Memory.TaskMan[roomName].spawn.queue.length > 0) {
    var Role = Memory.TaskMan[roomName].spawn.queue[0];
    var roleKey = Object.keys(Role);
    if (roles[roleKey[0]].build(Role[roleKey[0]]) == OK) {
      Memory.TaskMan[roomName].spawn.queue.shift();
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
  var roomOne = "E9N52";
  var spawnName = "Spawn1";
  switch (ticks) {
    case 1:
      Memory.TaskMan[roomOne].spawn.push({
        Carrier: {
          memory: { role: "Carrier", task: "get", iStore: 1, spawn: spawnName },
        },
      });
      break;
    // case 100:
    //   Memory.TaskMan[roomOne].spawn.push({ upCarrier: { memory: { role: "upCarrier", task: "reap", iStore:1, body: "body1", spawn: "Vat2" } } });
    //   //  Memory.TaskMan.E46N33.spawn.push({ Builder: { memory: { role: 'Builder', task:'get', spawn:"Vat1" }}});
    //   //  Memory.TaskMan.E46N33.spawn.push({ Carrier: { memory: { role: "Carrier", task: "get", iStore:0, spawn: "Vat1" } } });
    //   break;
    case 250:
      Memory.TaskMan.E9N52.spawn.push({
        Miner: {
          memory: {
            role: "Miner",
            say: 1,
            atDest: false,
            sourceType: FIND_SOURCES,
            body: "body1",
            sitPOS: { x: 15, y: 31, roomName: "E9N52" },
            spawn: "Spawn1",
          },
        },
      });
      break;
    case 350:
      //Memory.TaskMan.E46N33.spawn.push({ Lab: { memory: { role: "Lab", task: "getTask", spawn: "Vat1", body: "body1" } } });
      Memory.TaskMan[roomOne].spawn.push({
        Builder: { memory: { role: "Builder", task: "get", spawn: spawnName } },
      });
      break;
    case 400:
      Memory.TaskMan[roomOne].spawn.push({
        Miner: {
          memory: {
            role: "Miner",
            say: 6,
            atDest: false,
            sourceType: FIND_SOURCES,
            body: "body1",
            sitPOS: { x: 23, y: 36, roomName: roomOne },
            spawn: spawnName,
          },
        },
      });
      break;
    // case 500:
    //   Memory.TaskMan[roomOne].spawn.push({
    //     Miner: {
    //       memory: {
    //         role: 'Miner', say: 6, atDest: false, sourceType: FIND_MINERALS, body: "body3", sitPOS: { x: 37, y: 35, roomName: "E46N33" }, spawn: "Vat1"
    //       }
    //     }
    //   });
    //   break;
    // case 550:
    //   Memory.TaskMan[roomOne].spawn.push({ "Repair": { memory: { role: "Repair", task: "get", spawn: "Vat1" } } });
    //   break;
    // case 650:
    //         Memory.TaskMan[roomOne].spawn.push({
    //         Linker: {
    //          memory: {
    //             role: "Linker", run: 2, atDest: false, body: "body2", sitPOS: { x: 26, y: 21, roomName: "E46N33" }, spawn: "Vat1", task:"reap"}
    //           }
    //         });
    //     break;
    //     case 750:
    //         Memory.TaskMan[roomOne].spawn.push({
    //         Linker: {
    //          memory: {
    //             role: "Linker", run: 2, atDest: false, body: "body2", sitPOS: { x: 43, y: 25, roomName: "E46N33" }, spawn: "Vat1", task:"reap"}
    //           }
    //         });
    //     break;
    case 850:
      Memory.TaskMan[roomOne].spawn.push({
        Upgrader: {
          memory: {
            role: "Upgrader",
            body: "body3",
            source: 1,
            spawn: spawnName,
          },
        },
      });
      break;
    case 1000:
      Memory.TaskMan[roomOne].spawn.push({
        Upgrader: {
          memory: {
            role: "Upgrader",
            body: "body3",
            source: 2,
            spawn: spawnName,
          },
        },
      });
      break;
  }
}

displayAttackRings = function (aRoom, aTower) {
  aRoom.visual.circle(aTower.pos.x, aTower.pos.y, {
    fill: "transparent",
    stroke: "red",
    strokeWidth: 0.1,
    radius: 5,
  });
  aRoom.visual.circle(aTower.pos.x, aTower.pos.y, {
    fill: "transparent",
    stroke: "yellow",
    strokeWidth: 0.1,
    radius: 10,
  });
  return aRoom.visual.circle(aTower.pos.x, aTower.pos.y, {
    fill: "transparent",
    stroke: "blue",
    strokeWidth: 0.1,
    radius: 20,
  });
};
