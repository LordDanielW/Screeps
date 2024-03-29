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
spawnCreeps = function (spawnName) {
  let spawn = Game.spawns[spawnName];
  let roomName = spawn.room.name;

  if (!Memory.TaskMan[spawnName]) {
    // console.log("Spawn: " + spawnName + " not found in Memory.TaskMan");
    return;
  }

  // If Spawn que overloaded, clear and make a Carrier
  if (Memory.TaskMan[spawnName].spawn.length > 5) {
    Memory.TaskMan[spawnName].spawn = [];
    Memory.TaskMan[spawnName].spawn.push({ role: "Carrier" });
    Memory.TaskMan[spawnName].spawnListNumber = 0;
  }
  // If Spawning, Display it
  if (spawn.spawning) {
    utils.structureMessage(spawn.id, "🛠️" + spawn.spawning.name);
  }
  // Else Check Spawn Que
  else if (Memory.TaskMan[spawnName].spawn.length != 0) {
    var spawnMemory = Memory.TaskMan[spawnName].spawn[0];

    // Generate Unique Name
    let tName = spawnMemory.role;
    if (tName == "Signer") {
      tName = "👽 👾 🤖";
    }
    let newCreepName = tName + Memory.TaskMan.NameNum;

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

    // Keeps a unique name for spawned creeps
    Memory.TaskMan.NameNum++;
    if (Memory.TaskMan.NameNum >= 1000) {
      Memory.TaskMan.NameNum = 1;
    }

    // Try Spawn
    let response = Game.spawns[spawnName].spawnCreep(buildBody, newCreepName, {
      memory: spawnMemory,
      directions: spawnMemory.directions,
    });

    if (response == OK) {
      Memory.TaskMan[spawnName].spawn.shift();
    } else {
      utils.structureMessage(spawn.id, "🎊 " + response);
      // console.log("Error " + response + ". Spawning:" + spawnMemory.role);
    }
  }
  //  Else add to Que
  else {
    this.addSpawnQue(spawnName);

    // TODO: Add Back Later
    // // Count Miners and Carriers
    // // ToDo add for multi Rooms
    // var countRoles = {};
    // for (var name in Game.creeps) {
    //   var role = Game.creeps[name].memory.role;
    //   if (countRoles[role] == null) {
    //     countRoles[role] = 1;
    //   } else {
    //     countRoles[role]++;
    //   }
    // }
    // // Check Carriers
    // if (countRoles.Carrier == undefined || countRoles.Carrier < 1) {
    //   Memory.TaskMan[spawnName].spawn.push({ role: "Carrier" });
    // }
    // // Check Miners
    // else if (countRoles.Miner == undefined || countRoles.Miner < 1) {
    //   Memory.TaskMan[spawnName].spawn.push({ role: "Miner" });
    // }
  }
};

module.exports.spawnCreeps = spawnCreeps;

//
//
//
addSpawnQue = function (spawnName) {
  let spawnListNumber = Memory.TaskMan[spawnName].spawnListNumber;
  let spawnExtrasNumber = Memory.TaskMan[spawnName].spawnExtrasNumber;

  // Set if undefined
  if (spawnListNumber == undefined || spawnExtrasNumber == undefined) {
    Memory.TaskMan[spawnName].spawnListNumber = -1;
    Memory.TaskMan[spawnName].spawnExtrasNumber = -1;
  }
  // if end of list go to extras
  else if (spawnListNumber != -1) {
    if (myMemory.spawnList[spawnName].length <= spawnListNumber) {
      Memory.TaskMan[spawnName].spawnListNumber = -1;
      Memory.TaskMan[spawnName].spawnExtrasNumber = 0;
    }
    // Add routine creeps to spawn que
    else if (Memory.TaskMan[spawnName].spawn.length == 0) {
      Memory.TaskMan[spawnName].spawn.push(
        myMemory.spawnList[spawnName][spawnListNumber]
      );
      Memory.TaskMan[spawnName].spawnListNumber++;
    }
  }
  // check for extras to add to spawn que
  else if (spawnExtrasNumber != -1) {
    this.conditionalSpawnQue(spawnName);
  }
};

module.exports.addSpawnQue = addSpawnQue;

//  more Creeps
conditionalSpawnQue = function (spawnName) {
  switch (Memory.TaskMan[spawnName].spawnExtrasNumber) {
    case 10:
      //  Check for Minerals
      if (
        Game.spawns[spawnName].room.find(FIND_MINERALS).length > 0 &&
        Game.spawns[spawnName].room.find(FIND_MINERALS)[0].mineralAmount > 0 &&
        Game.spawns[spawnName].room.find(FIND_STRUCTURES, {
          filter: (structure) => {
            return (
              structure.structureType == STRUCTURE_EXTRACTOR &&
              structure.isActive()
            );
          },
        }).length > 0
      ) {
        let mineralType = Game.spawns[spawnName].room.find(FIND_MINERALS)[0];

        let ePos = Game.spawns[spawnName].room.find(FIND_STRUCTURES, {
          filter: (structure) => {
            return (
              structure.structureType == STRUCTURE_EXTRACTOR &&
              structure.isActive()
            );
          },
        })[0].pos;

        // Find closest container by range
        let closestContainer = ePos.findClosestByRange(FIND_STRUCTURES, {
          filter: (structure) => {
            return structure.structureType == STRUCTURE_CONTAINER;
          },
        });
        if (closestContainer == null || closestContainer.pos.isNearTo()) {
          return;
        }
        let cPOS = closestContainer.pos;

        Memory.TaskMan[spawnName].spawn.push({
          role: "Miner",
          say: 1,
          atDest: false,
          sourceType: FIND_MINERALS,
          body: [
            [WORK, 15],
            [MOVE, 5],
          ],
          sitPOS: { x: cPOS.x, y: cPOS.y, roomName: cPOS.roomName },
        });

        Memory.TaskMan[spawnName].spawn.push({
          role: "Linker",
          resource: mineralType.mineralType,
          source: closestContainer.id,
          destination: Game.spawns[spawnName].room.terminal.id,
          body: [
            [CARRY, 8],
            [MOVE, 8],
          ],
        });
      }
      break;
    case 1:
      //  Check for Construction Sites
      let roomConstructionSites = false;
      Object.keys(Game.constructionSites).forEach((x) => {
        if (Game.constructionSites[x].room == Game.spawns[spawnName].room) {
          roomConstructionSites = true;
        }
      });
      if (roomConstructionSites) {
        let myBody = [];
        // Find body build by room energy
        if (Game.spawns[spawnName].room.energyCapacityAvailable >= 850) {
          myBody = [
            [WORK, 5],
            [CARRY, 2],
            [MOVE, 5],
          ];
        } else {
          myBody = [
            [WORK, 2],
            [CARRY, 1],
            [MOVE, 1],
          ];
        }

        Memory.TaskMan[spawnName].spawn.push({
          role: "Builder",
          body: myBody,
        });
      }
      break;
    case 0:
      // Check if room storage energy is over 400k
      if (
        Game.spawns[spawnName].room.storage != undefined &&
        Game.spawns[spawnName].room.storage.store[RESOURCE_ENERGY] > 400000
      ) {
        Memory.TaskMan[spawnName].spawn.push({
          role: "upCarrier",
          body: [
            [CARRY, 8],
            [MOVE, 4],
          ],
        });

        Memory.TaskMan[spawnName].spawn.push({
          role: "Upgrader",
          body: [
            [WORK, 7],
            [CARRY, 1],
            [MOVE, 2],
          ],
        });
      }
      break;

    default:
      Memory.TaskMan[spawnName].spawnExtrasNumber = -1;
      return;
  }

  Memory.TaskMan[spawnName].spawnExtrasNumber++;
};

module.exports.conditionalSpawnQue = conditionalSpawnQue;
