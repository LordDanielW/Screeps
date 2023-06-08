// Pick Flag function
//
//
global.pF = function (flagName) {
  if (typeof flagName === "string") {
    Memory.selectFlag = flagName;
    // return if flagName is in Game.flags
    return Game.flags[flagName] != undefined;
  } else if (typeof flagName === "number") {
  }
};

// Pick Creep function
//
//
global.pC = function (creepName) {
  if (typeof creepName === "string") {
    Memory.selectCreep = creepName;
    // return if creepName is in Game.creeps
    return Game.creeps[creepName] != undefined;
  } else if (typeof creepName === "number") {
  }
};
exports.pC = pC;
// End Pick Creep function

// Move Creep function
//
//
global.mC = function (moveString) {
  Memory.creepMove = moveString;
};
exports.mC = mC;

// Move Creep function
//
//
moveCreep = function (creep) {
  if (Memory.creepMove && Memory.creepMove.length > 0) {
    // get first charcter of creepMove
    var move = Memory.creepMove.charAt(0);

    let resp = "none";
    let moveDir = "";
    switch (move) {
      // move creep up
      case "w":
        moveDir = TOP;
        resp = creep.move(TOP);
        break;
      // move creep down
      case "x":
        moveDir = BOTTOM;
        resp = creep.move(BOTTOM);
        break;
      // move creep left
      case "a":
        moveDir = LEFT;
        resp = creep.move(LEFT);
        break;
      // move creep right
      case "d":
        moveDir = RIGHT;
        resp = creep.move(RIGHT);
        break;
      // move creep up and left
      case "q":
        moveDir = TOP_LEFT;
        resp = creep.move(TOP_LEFT);
        break;
      // move creep up and right
      case "e":
        moveDir = TOP_RIGHT;
        resp = creep.move(TOP_RIGHT);
        break;
      // move creep down and left
      case "z":
        moveDir = BOTTOM_LEFT;

        break;
      // move creep down and right
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
exports.moveCreep = moveCreep;
// End Move Creep function

//  Spawn Creep function
//
//
global.sC = function (spawnType) {
  switch (spawnType) {
    case "Miner":
      Memory.TaskMan.Vat3.spawn.push({
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
      });
      break;
    case "Signer":
      Memory.TaskMan.Vat3.spawn.push({
        role: "Signer",
        task: "MOVIN",
        body: [
          [CLAIM, 1],
          [MOVE, 1],
        ],
        movePOS: { x: 26, y: 48, roomName: "E12N51" },
      });
      break;
    case "Linker":
      Memory.TaskMan.Vat5.spawn.push({
        role: "Linker",
        body: [
          [CARRY, 1],
          [MOVE, 1],
        ],
      });
    case "Carrier":
      Memory.TaskMan.Vat3.spawn.push({
        role: "Carrier",
        body: [
          [CARRY, 8],
          [MOVE, 4],
        ],
      });
      break;
    case "Builder":
      Memory.TaskMan.Vat3.spawn.push({
        role: "Builder",
        task: "MOVIN",
        body: [
          [WORK, 6],
          [CARRY, 6],
          [MOVE, 12],
        ],
        movePOS: { x: 27, y: 45, roomName: "E12N51" },
      });
      break;
    case "Upgrader":
      Memory.TaskMan.Vat3.spawn.push({
        role: "Upgrader",
        body: [
          [WORK, 10],
          [CARRY, 10],
          [MOVE, 20],
        ],
        movePOS: { x: 27, y: 45, roomName: "E12N51" },
      });
      break;
    case "Repair":
      Memory.TaskMan.Vat3.spawn.push({
        role: "Repair",
        body: [
          [WORK, 1],
          [CARRY, 1],
          [MOVE, 1],
        ],
      });
      break;
    case "upCarrier":
      Memory.TaskMan.Vat4.spawn.push({
        role: "upCarrier",
        body: [
          [CARRY, 6],
          [MOVE, 3],
        ],
      });
      break;
    case "Attacker":
      Memory.TaskMan.Vat3.spawn.push({
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
      });
      break;
    case "Breaker":
      Memory.TaskMan.Vat3.spawn.push({
        role: "Breaker",
        body: [
          [WORK, 10],
          [MOVE, 10],
        ],
        task: "MOVIN",
        roomPos: { x: 31, y: 45, roomName: "E12N51" },
        break: "643d3f7ea9d40144c4aca0c8",
      });
      break;
    case "B1":
      Memory.TaskMan.Vat3.spawn.push({
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
      });
      break;
    case "B2":
      Memory.TaskMan.Vat2.spawn.push({
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
      });
      break;
    case "Healer":
      Memory.TaskMan.Spawn1.spawn.push({
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
      });
      break;
    case "Trader":
      Memory.TaskMan.Spawn1.spawn.push({
        role: "Trader",
        body: [
          [CARRY, 2],
          [MOVE, 2],
        ],
        transferType: RESOURCE_ENERGY,
        source: "6447e69b9f63116b12ee59f9",
        dest: "64536a7d9f75eab498c15957",
      });
      break;
    default:
      return false;
  }
  return true;
};

exports.sC = sC;
// End Spawn Creep function
