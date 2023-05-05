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
spawnCreeps = function (theRoom) {
  let roomName = theRoom.name;
  let spawnName = "Spawn1";
  let spawn = Game.spawns[spawnName];
  // If Spawn que overloaded, clear and make a Carrier
  if (Memory.TaskMan[roomName].spawn.length > 5) {
    Memory.TaskMan[roomName].spawn = [];
    Memory.TaskMan[roomName].spawn.push({ role: "Carrier" });
    Memory.TaskMan[roomName].spawnNumber = 0;
  }
  // If Spawning, Display it
  if (spawn.spawning) {
    utilities.structureMessage(spawn.id, "🛠️" + spawn.spawning.name);
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
      utilities.structureMessage(spawn.id, "🎊 " + response);
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
};

module.exports.spawnCreeps = spawnCreeps;

//
//
//
addSpawnQue = function (roomNumber) {};

//  more Creeps
conditionalSpawnQue = function (roomNumber) {
  switch (ticks) {
    case 150:
      //  Check for Minerals
      if (
        Game.rooms[roomOne].find(FIND_MINERALS).length > 0 &&
        Game.rooms[roomOne].find(FIND_MINERALS)[0].mineralAmount > 0
      ) {
        addSpawn.push([
          roomOne,
          {
            role: "Miner",
            say: 1,
            atDest: false,
            sourceType: FIND_MINERALS,
            body: [
              [WORK, 15],
              [MOVE, 5],
            ],
            sitPOS: { x: 42, y: 39, roomName: roomOne },
            spawn: spawnName,
          },
        ]);
      }
      break;
    case 350:
      //  Check for Construction Sites
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
  }
};
