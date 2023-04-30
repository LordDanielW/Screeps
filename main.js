//  Import Modules
//
var roles = require("creeps.all");
var structures = require("structures.all");

//  Variables
var myRoomOne = Game.rooms.E9N52;
//var myRoomTwo = Game.rooms.W16N39;

//  Main Loop
//
module.exports.loop = function () {
  // Last Loop Failed
  //  if the last loop failed, try catch everything
  let lastLoopFailed = Memory.lastLoopFailed;
  Memory.lastLoopFailed = true;

  if (lastLoopFailed) {
    //  Slow Loop
    module.exports.slowLoop();
  } else {
    // Fast Loop
    module.exports.fastLoop();
    Memory.lastLoopFailed = false;
  }
};

//  Fast loop
//
module.exports.fastLoop = function () {
  //  Ticks
  //  basis for actions on a creeps 1500 tick life.
  doTicks();

  //  Garbage Collect
  //  remove dead creeps from memory
  garbageCollect();

  //  Towers
  //  check repair, heal, and attack
  //  show attack rings
  runTowers(myRoomOne);

  //  Screep Run Loop
  //
  runScreeps();

  //  run Linker Transfer
  //
  // runLinkerTransfer(myRoomOne);

  // run Factory
  //
  // runFatcory(myRoomOne);

  // run Spawn
  //
  spawnCreeps(myRoomOne);
};
// End Fast Loop

//  Slow Loop
//
module.exports.slowLoop = function () {
  let stillFailing = false;

  //  Ticks
  try {
    doTicks();
  } catch (e) {
    console.log("Ticks Fail");
    console.log(e);
    stillFailing = true;
  }

  //  Garbage Collect
  try {
    garbageCollect();
  } catch (e) {
    console.log("Garbage Collect Fail");
    console.log(e);
    stillFailing = true;
  }

  //  Towers
  try {
    runTowers(myRoomOne);
  } catch (e) {
    console.log("Tower Fail");
    console.log(e);
    stillFailing = true;
  }

  //  Try Screep Run Loop
  try {
    runTryScreeps();
  } catch (e) {
    console.log("Screep Run Loop Fail");
    console.log(e);
    stillFailing = true;
  }

  //  run Linker Transfer
  // try {
  //   runLinkerTransfer(myRoomOne);
  // } catch (e) {
  //   console.log("Linker Transfer Fail");
  //   console.log(e);
  //   stillFailing = true;
  // }

  // run Factory
  // try {
  //   runFatcory(myRoomOne);
  // } catch (e) {
  //   console.log("Factory Fail");
  //   console.log(e);
  //   stillFailing = true;
  // }

  // run Spawn
  try {
    spawnCreeps(myRoomOne);
  } catch (e) {
    console.log("Spawn Fail");
    console.log(e);
    Memory.TaskMan.E9N52.spawn.shift();
    stillFailing = true;
  }

  Memory.lastLoopFailed = stillFailing;
};
// End Slow Loop

// run Towers
//
function runTowers(theRoom) {
  var towers = theRoom.find(FIND_STRUCTURES, {
    filter: (structure) => {
      return structure.structureType == STRUCTURE_TOWER;
    },
  });
  for (var i = 0; i < towers.length; i++) {
    structures.Tower.run(towers[i]);
    displayAttackRings(theRoom, towers[i]);
  }
}
// End Towers

// Run Screeps
//
function runScreeps() {
  for (var name in Game.creeps) {
    var creep = Game.creeps[name];
    roles[creep.memory.role].run(creep);
  }
}
// End Run Screeps

// run try Screeps
//
function runTryScreeps() {
  for (var name in Game.creeps) {
    var creep = Game.creeps[name];
    try {
      roles[creep.memory.role].run(creep);
    } catch (e) {
      console.log("Creep Fail");
      console.log(e);
    }
  }
}

//  run link transfer
//
function runLinkerTransfer(theRoom) {
  var linkers = theRoom.find(FIND_STRUCTURES, {
    filter: (structure) => {
      return structure.structureType == STRUCTURE_LINK;
    },
  });
  var error = linkers[0].transferEnergy(linkers[1]);
  var error2 = linkers[2].transferEnergy(linkers[1]);
}

// run factory
//
function runFatcory(theRoom) {
  var factory = theRoom.find(FIND_STRUCTURES, {
    filter: (structure) => {
      return structure.structureType == STRUCTURE_FACTORY;
    },
  })[0];
  if (factory.cooldown == 0) {
    factory.produce(RESOURCE_LEMERGIUM_BAR);
    if (factory.store.energy == null || factory.store.energy < 5000) {
      factory.produce(RESOURCE_ENERGY);
    } else {
      factory.produce(RESOURCE_LEMERGIUM_BAR);
    }
  }
}

const SPAWN_PARAMETERS_DEFAULT = {
  role: "Carrier",
  task: "GET",
  source: [],
  spawn: "Spawn1",
  body: [
    [MOVE, 1],
    [WORK, 1],
    [CARRY, 1],
  ],
};

//  Spawn Creeps
//
//
function spawnCreeps(theRoom) {
  let roomName = theRoom.name;
  let spawnName = "Spawn1";
  let spawn = Game.spawns[spawnName];
  // If Spawn que overloaded, clear and make a Carrier
  if (Memory.TaskMan[roomName].spawn.length > 5) {
    Memory.TaskMan[roomName].spawn = [];
    Memory.TaskMan[roomName].spawn.push({ role: "Carrier" });
  }
  // If Spawning, Display it
  if (spawn.spawning) {
    structureMessage(spawn.id, "🛠️" + spawn.spawning.name);
  }
  // Else Check Spawn Que
  else if (Memory.TaskMan[roomName].spawn.length != 0) {
    var spawnMemory = Memory.TaskMan[roomName].spawn[0];

    // Set Spawn Parameters
    let selectSpawn = spawnMemory.spawn;
    if (!selectSpawn) {
      // ToDo grab first spawn in room
      selectSpawn = "Spawn1";
    }

    // Generate Unique Name
    let newCreepName = spawnMemory.role + Memory.TaskMan.NameNum;
    Memory.TaskMan.NameNum++;

    // Build Body
    let creepBody = spawnMemory.body;
    if (!creepBody) {
      creepBody = SPAWN_PARAMETERS_DEFAULT.body;
    }

    let buildBody = [];
    for (let i = 0; i < creepBody.length; i++) {
      for (var j = 0; j < creepBody[i][1]; j++) {
        buildBody.push(creepBody[i][0]);
      }
    }

    // Try Spawn
    let response = Game.spawns[selectSpawn].spawnCreep(
      buildBody,
      newCreepName,
      { memory: spawnMemory }
    );

    if (response == OK) {
      Memory.TaskMan[roomName].spawn.shift();
    } else {
      structureMessage(spawn.id, "🎊 " + response);
      // console.log("Error " + response + ". Spawning:" + Role.memory.role);
    }
  }
  //  Ensure Miner and Carriers are up
  else {
    // Count Miners and Carriers
    // ToDo add for multi Rooms
    var countRoles = {};
    for (var name in Game.creeps) {
      var role = Game.creeps[name].memory.role;
      if (countRoles[role] == null) {
        countRoles[role] = 1;
      } else {
        countRoles[role]++;
      }
    }
    // Check Carriers
    if (countRoles.Carrier == undefined || countRoles.Carrier < 1) {
      Memory.TaskMan[roomName].spawn.push({ role: "Carrier" });
    }
    // Check Miners
    else if (countRoles.Miner == undefined || countRoles.Miner < 1) {
      Memory.TaskMan[roomName].spawn.push({ role: "Miner" });
    }
  }
}

//  Structure Message
//
//
function structureMessage(structureId, message) {
  let structure = Game.getObjectById(structureId);
  structure.pos.x += 1;
  structure.room.visual.text(message, structure.pos, {
    align: "left",
    opacity: 0.8,
  });
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
function doTicks() {
  var ticks = Memory.TaskMan.Tick;
  Memory.TaskMan.Tick++;
  if (Memory.TaskMan.Tick >= 1460) {
    Memory.TaskMan.Tick = 0;
    // Keeps a unique name for spawned creeps
    if (Memory.TaskMan.NameNum >= 200) {
      Memory.TaskMan.NameNum = 1;
    }
  }

  var roomOne = "E9N52";
  var spawnName = "Spawn1";
  //  Memory.TaskMan.E9N52.spawn.push({ role: '' });
  //  Miner  Carrier  Builder  Upgrader  Repair upCarrier

  let addSpawn = [];
  switch (ticks) {
    case 1:
      addSpawn.push([
        roomOne,
        {
          role: "Carrier",
          body: [
            [CARRY, 10],
            [MOVE, 5],
          ],
          spawn: spawnName,
        },
      ]);
      break;
    case 250:
      addSpawn.push([
        roomOne,
        {
          role: "Miner",
          say: 1,
          atDest: false,
          sourceType: FIND_SOURCES,
          body: [
            [WORK, 5],
            [MOVE, 2],
          ],
          sitPOS: { x: 15, y: 31, roomName: roomOne },
          spawn: spawnName,
        },
      ]);
      break;
    case 350:
      addSpawn.push([
        roomOne,
        {
          role: "Upgrader",
          body: [
            [WORK, 8],
            [CARRY, 2],
            [MOVE, 3],
          ],
          iStore: 2,
        },
      ]);

      // roomOne
      // "E9N52"

      let roomConstructionSites = false;
      Object.keys(Game.constructionSites).forEach((x) => {
        if (Game.constructionSites[x].room.name == roomOne) {
          roomConstructionSites = true;
          console.log("true");
          return;
        }
      });
      if (roomConstructionSites) {
        addSpawn.push([
          roomOne,
          {
            role: "Builder",
            body: [
              [WORK, 5],
              [CARRY, 2],
              [MOVE, 5],
            ],
            spawn: spawnName,
          },
        ]);
      }
      break;
    case 400:
      addSpawn.push([
        roomOne,
        {
          role: "Miner",
          say: 6,
          atDest: false,
          sourceType: FIND_SOURCES,
          body: [
            [WORK, 5],
            [MOVE, 2],
          ],
          sitPOS: { x: 23, y: 36, roomName: roomOne },
          spawn: spawnName,
        },
      ]);
      break;
    case 550:
      addSpawn.push([
        roomOne,
        {
          role: "Repair",
          body: [
            [WORK, 5],
            [CARRY, 2],
            [MOVE, 5],
          ],
          spawn: spawnName,
        },
      ]);
      break;
    case 650:
      addSpawn.push([
        roomOne,
        {
          role: "upCarrier",
          body: [
            [CARRY, 10],
            [MOVE, 5],
          ],
          spawn: spawnName,
        },
      ]);
      break;
    case 850:
      addSpawn.push([
        roomOne,
        {
          role: "Upgrader",
          body: [
            [WORK, 8],
            [CARRY, 2],
            [MOVE, 3],
          ],
          iStore: 2,
        },
      ]);
      break;
  }

  // Move Added Spawns from local to remote Memory
  for (let i = 0; i < addSpawn.length; i++) {
    Memory.TaskMan[addSpawn[i][0]].spawn.push(addSpawn[i][1]);
  }
}

//  Display Attack Rings
//
//
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
