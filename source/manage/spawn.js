// Default Spawn Parameters
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
runSpawner = function (spawn) {
  const spawnName = spawn.name;
  const roomName = spawn.room.name;
  const room = spawn.room;

  if (!Memory.TaskMan[spawnName]) {
    // console.log("Spawn: " + spawnName + " not found in Memory.TaskMan");
    return;
  }

  // If Spawn que overloaded, clear and make a Carrier
  if (Memory.TaskMan[spawnName].spawnList.length > 15) {
    Memory.TaskMan[spawnName].spawnList = [];
    Memory.TaskMan[spawnName].spawnList.push({ role: "Carrier" });
    Memory.TaskMan[spawnName].spawnListNumber = 0;
  }

  // If Spawning, Display it
  if (spawn.spawning) {
    utils.structureMessage(spawn.id, "🛠️" + spawn.spawning.name);
  }
  // Else Check Spawn Que
  else if (Memory.TaskMan[spawnName].spawnList.length != 0) {
    var spawnMemory = Memory.TaskMan[spawnName].spawnList[0];

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
      Memory.TaskMan[spawnName].spawnList.shift();
    } else {
      if (response == ERR_NOT_ENOUGH_ENERGY) {
        // Count creeps in this room
        const creepsInRoom = _.filter(
          Game.creeps,
          (c) => c.room.name === room.name
        );

        if (creepsInRoom.length < 1) {
          console.log("No Creeps in Room: " + roomName + " Emergency Spawn");
          emergencySpawn(spawn);
          return;
        }
      }
      utils.structureMessage(spawn.id, "🎊 " + response);
      // console.log("Error " + response + ". Spawning:" + spawnMemory.role);
    }
  }
  //  Else Check for Emergency Spawns
  else {
    // Count creeps in this room
    const creepsInRoom = _.filter(
      Game.creeps,
      (c) => c.room.name === room.name
    );

    if (creepsInRoom.length < 1) {
      // console.log("No Creeps in Room: " + roomName);
      emergencySpawn(spawn);
      return;
    }
  }
};

module.exports.runSpawner = runSpawner;

// Emergency Spawn
//
emergencySpawn = function (spawn) {
  const spawnName = spawn.name;
  const roomName = spawn.room.name;
  const room = spawn.room;

  console.log("No Creeps in Room: " + roomName + " Emergency Spawn");

  Memory.TaskMan[spawnName].spawnList = [];

  // Spawn Carrier first if energy is available
  const droppedEnergy = room.find(FIND_DROPPED_RESOURCES, {
    filter: (resource) => resource.resourceType === RESOURCE_ENERGY,
  });
  const containers = room.find(FIND_STRUCTURES, {
    filter: (structure) =>
      structure.structureType === STRUCTURE_CONTAINER &&
      structure.store[RESOURCE_ENERGY] > 0,
  });
  const storage =
    room.storage && room.storage.store[RESOURCE_ENERGY] > 0
      ? room.storage.store[RESOURCE_ENERGY]
      : 0;

  let totalEnergy = storage;
  for (let energy of droppedEnergy) {
    totalEnergy += energy.amount;
  }
  for (let container of containers) {
    totalEnergy += container.store[RESOURCE_ENERGY];
  }

  if (totalEnergy > 300) {
    Memory.TaskMan[spawnName].spawnList.push({
      role: "Carrier",
      body: [
        [CARRY, 2],
        [MOVE, 1],
      ],
    });
  }

  // Find a source
  const sources = room.find(FIND_SOURCES);

  // Miner
  for (let i = 0; i < sources.length; i++) {
    const source = sources[i];
    const pos = findMiningPosition(source, spawn);

    Memory.TaskMan[spawnName].spawnList.push({
      role: "Miner",
      say: 1,
      atDest: false,
      sourceType: RESOURCE_ENERGY,
      sourceId: source.id,
      body: [
        [WORK, 2],
        [MOVE, 1],
      ],
      sitPOS: pos,
    });
  }

  // Carrier

  Memory.TaskMan[spawnName].spawnList.push({
    role: "Carrier",
    body: [
      [CARRY, 2],
      [MOVE, 1],
    ],
  });
};
