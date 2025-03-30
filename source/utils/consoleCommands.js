// Pick Flag
//
global.pF = function (flagName) {
  if (typeof flagName === "string") {
    Memory.selectFlag = flagName;
    return Game.flags[flagName] != undefined;
  }
};

// Pick Creep
//
global.pC = function (creepName) {
  if (typeof creepName === "string") {
    Memory.selectCreep = creepName;
    return Game.creeps[creepName] != undefined;
  }
};

// Pick Spawn
//
global.pS = function (spawnName) {
  if (typeof spawnName === "string") {
    Memory.selectSpawn = spawnName;
    return Game.spawns[spawnName] != undefined;
  }
};

// Move Creep Command
//
global.mC = function (moveString) {
  Memory.creepMove = moveString;
};

// Move Creep Logic
//
moveCreep = function (creep) {
  if (Memory.creepMove && Memory.creepMove.length > 0) {
    // get first charcter of creepMove
    var move = Memory.creepMove.charAt(0);

    let resp = "none";
    let moveDir = "";
    switch (move) {
      // up
      case "w":
        moveDir = TOP;
        resp = creep.move(TOP);
        break;
      // down
      case "x":
        moveDir = BOTTOM;
        resp = creep.move(BOTTOM);
        break;
      // left
      case "a":
        moveDir = LEFT;
        resp = creep.move(LEFT);
        break;
      // right
      case "d":
        moveDir = RIGHT;
        resp = creep.move(RIGHT);
        break;
      // up and left
      case "q":
        moveDir = TOP_LEFT;
        resp = creep.move(TOP_LEFT);
        break;
      // up and right
      case "e":
        moveDir = TOP_RIGHT;
        resp = creep.move(TOP_RIGHT);
        break;
      // down and left
      case "z":
        moveDir = BOTTOM_LEFT;

        break;
      // down and right
      case "c":
        moveDir = BOTTOM_RIGHT;
        break;
    }
    if (moveDir != "") {
      resp = creep.move(moveDir);
      // creep.say(resp);
      // remove first character of creepMove
      if (resp == OK) {
        Memory.creepMove = Memory.creepMove.substring(1);
      }
    }
  }
};
// End Move Creep

//  Spawn Creep
//
global.sC = function (spawnType) {
  if (Memory.selectSpawn != undefined) {
    spawn = Game.spawns[Memory.selectSpawn];
  }
  if (spawn == undefined) {
    spawn = Object.values(Game.spawns)[0];
  }
  spawnName = spawn.name;

  let spawnObject;

  switch (spawnType) {
    case "Miner":
      spawnObject = {
        role: "Miner",
        say: 1,
        atDest: false,
        direction: BOTTOM,
        sourceType: FIND_SOURCES,
        body: [
          [WORK, 1],
          [MOVE, 1],
        ],
        sitPOS: { x: 38, y: 27, roomName: "E13N49" },
      };
      break;
    case "Signer":
      spawnObject = {
        role: "Signer",
        task: "MOVIN",
        body: [
          [CLAIM, 1],
          [MOVE, 1],
        ],
        movePOS: { x: 26, y: 48, roomName: "E12N51" },
      };
      break;
    case "Linker":
      spawnObject = {
        role: "Linker",
        body: [
          [CARRY, 1],
          [MOVE, 1],
        ],
      };
    case "Carrier":
      spawnObject = {
        role: "Carrier",
        body: [
          [CARRY, 8],
          [MOVE, 4],
        ],
      };
      break;
    case "Builder":
      spawnObject = {
        role: "Builder",
        task: "MOVIN",
        body: [
          [WORK, 6],
          [CARRY, 6],
          [MOVE, 12],
        ],
        movePOS: { x: 27, y: 45, roomName: "E12N51" },
      };
      break;
    case "Upgrader":
      spawnObject = {
        role: "Upgrader",
        body: [
          [WORK, 10],
          [CARRY, 10],
          [MOVE, 20],
        ],
        movePOS: { x: 27, y: 45, roomName: "E12N51" },
      };
      break;
    case "Repair":
      spawnObject = {
        role: "Repair",
        body: [
          [WORK, 1],
          [CARRY, 1],
          [MOVE, 1],
        ],
      };
      break;
    case "upCarrier":
      spawnObject = {
        role: "upCarrier",
        body: [
          [CARRY, 6],
          [MOVE, 3],
        ],
      };
      break;
    case "Attacker":
      spawnObject = {
        role: "Attacker",
        body: [
          [TOUGH, 3],
          [WORK, 0],
          [ATTACK, 6],
          [CARRY, 0],
          [MOVE, 9],
        ],
        task: "MOVIN",
        roomPos: { x: 29, y: 8, roomName: "E9N54" },
        // break: "6453dd062dcf1466c079d6d8",
      };
      break;
    case "Breaker":
      spawnObject = {
        role: "Breaker",
        body: [
          [WORK, 10],
          [MOVE, 10],
        ],
        task: "MOVIN",
        roomPos: { x: 31, y: 45, roomName: "E12N51" },
        break: "643d3f7ea9d40144c4aca0c8",
      };
      break;
    case "B1":
      spawnObject = {
        role: "Blinker",
        body: [
          [TOUGH, 16],
          [WORK, 0],
          [HEAL, 4],
          [CARRY, 0],
          [MOVE, 22],
        ],
        task: "MOVIN",
        roomPos: { x: 24, y: 48, roomName: "E12N51" },
        break: "645a5973456ee54de5e607f3",
      };
      break;
    case "B2":
      spawnObject = {
        role: "Blinker",
        body: [
          [TOUGH, 10],
          [WORK, 0],
          [HEAL, 1],
          [CARRY, 0],
          [MOVE, 11],
        ],
        task: "MOVIN",
        roomPos: { x: 0, y: 13, roomName: "E10N54" },
        break: "645a5973456ee54de5e607f3",
      };
      break;
    case "Healer":
      spawnObject = {
        role: "Breaker",
        body: [
          [TOUGH, 0],
          [HEAL, 2],
          [WORK, 0],
          [CARRY, 0],
          [MOVE, 2],
        ],
        task: "MOVIN",
        roomPos: { x: 48, y: 25, roomName: "E10N54" },
        break: "6453dd062dcf1466c079d6d8",
      };
      break;
    case "Trader":
      spawnObject = {
        role: "Trader",
        body: [
          [CARRY, 2],
          [MOVE, 2],
        ],
        transferType: RESOURCE_ENERGY,
        source: "6447e69b9f63116b12ee59f9",
        dest: "64536a7d9f75eab498c15957",
      };
      break;
    default:
      return false;
  }

  Memory.TaskMan[selectSpawn].spawnList.push(spawnObject);
  return true;
};

// Reset
//
global.reset = function () {
  console.log("Executing complete restart command...");

  // Kill all creeps
  for (const name in Game.creeps) {
    console.log(`Killing creep: ${name}`);
    Game.creeps[name].suicide();
  }

  MemoryMain.initialize(true);
  // Reset stats
  // Memory.stats = {};

  // Clear creep memory to avoid memory leaks
  for (const name in Memory.creeps) {
    if (!Game.creeps[name]) {
      console.log(`Clearing memory for creep: ${name}`);
      delete Memory.creeps[name];
    }
  }

  // // Reset cycle and phase progress
  // if (Memory.cycle) {
  //   console.log("Resetting cycle progress and tick counter");
  //   Memory.cycle = {
  //     startTick: Game.time, // Reset start tick to now
  //     currentPhase: 1, // Reset to phase 1
  //     elapsedTicks: 0, // Reset elapsed ticks
  //     lastSpawnTick: 0, // Reset spawn tracking
  //     scheduledSpawns: {}, // Clear scheduled spawns
  //   };
  // }

  // Reset spawn queues if they exist
  if (Memory.spawn) {
    console.log("Clearing spawn queues");
    Memory.spawn.queue = [];
    Memory.spawn.stats = {
      totalSpawned: 0,
      spawnsByVariant: {},
      idleTicks: 0,
    };
  }

  console.log(
    "Full restart completed. All creeps terminated, stats reset, and cycle progress reset."
  );
  return "OK";
};

/**
 * Print out Memory as JSON, and all creeps memory
 */
global.printMem = function (stringMemPiece) {
  console.log("===== MEMORY DUMP =====");

  // Print global Memory object
  if (stringMemPiece.length == 0) {
    console.log("Global Memory:");
    console.log(JSON.stringify(Memory, null, 2));
  } else if (stringMemPiece == "creep") {
    // Print all creep memory
    console.log("\nCreep Memory:");
    for (const name in Game.creeps) {
      const creep = Game.creeps[name];
      console.log(`${name} (${creep.memory.role}):`);
      console.log(JSON.stringify(creep.memory, null, 2));
    }
  } else {
    // Print specific memory piece
    const memoryPiece = Memory[stringMemPiece];
    if (memoryPiece) {
      console.log(`\nMemory[${stringMemPiece}]:`);
      console.log(JSON.stringify(memoryPiece, null, 2));
    } else {
      console.log(`No memory found for ${stringMemPiece}`);
    }
  }
  console.log("===== END MEMORY DUMP =====");
  return "OK";
};

/**
 * Print current cycle information
 */
global.printCycle = function () {
  if (!Memory.cycle) {
    console.log("Cycle manager not initialized");
    return "ERROR";
  }

  console.log("===== CYCLE STATUS =====");
  console.log(`Start Tick: ${Memory.cycle.startTick}`);
  console.log(`Current Phase: ${Memory.cycle.currentPhase}`);
  console.log(`Elapsed Ticks: ${Memory.cycle.elapsedTicks}`);
  console.log(`Last Spawn Tick: ${Memory.cycle.lastSpawnTick}`);

  console.log("\nScheduled Spawns:");
  for (const variant in Memory.cycle.scheduledSpawns) {
    const data = Memory.cycle.scheduledSpawns[variant];
    console.log(
      `- ${variant}: ${data.quantity}x remaining (${data.energy} energy)`
    );
  }

  console.log("===== END CYCLE STATUS =====");
  return "OK";
};

/**
 * Skip to a specific tick in the cycle (for testing)
 */
global.skipToTick = function (targetTick) {
  if (!Memory.cycle) {
    console.log("Cycle manager not initialized");
    return "ERROR";
  }

  if (typeof targetTick !== "number" || targetTick < 0) {
    console.log("Invalid tick number. Please provide a positive number.");
    return "ERROR";
  }

  // Calculate the new start tick that would make elapsedTicks = targetTick
  const newStartTick = Game.time - targetTick;

  console.log(`Skipping to tick ${targetTick}`);
  Memory.cycle.startTick = newStartTick;
  Memory.cycle.elapsedTicks = targetTick;

  // Clear scheduled spawns (will be repopulated on next update)
  Memory.cycle.scheduledSpawns = {};

  console.log(`Time travel complete. Elapsed ticks is now ${targetTick}`);
  return "OK";
};
