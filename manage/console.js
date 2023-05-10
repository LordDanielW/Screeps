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
    case "Signer":
      Memory.TaskMan.Spawn1.spawn.push({
        role: "Signer",
        task: "MOVIN",
        say: 1,
        atDest: false,
        body: [
          [CLAIM, 1],
          [MOVE, 1],
        ],
        sitPOS: { x: 42, y: 18, roomName: "E14N49" },
      });
      break;
    case "Miner":
      Memory.TaskMan.Vat3.spawn.push({
        role: "Miner",
        say: 1,
        atDest: false,
        direction: BOTTOM,
        sourceType: FIND_SOURCES,
        body: [
          [WORK, 4],
          [MOVE, 1],
        ],
        sitPOS: { x: 28, y: 43, roomName: "E13N49" },
      });
      break;
    case "Carrier":
      Memory.TaskMan.Vat4.spawn.push({
        role: "Carrier",
        body: [
          [CARRY, 2],
          [MOVE, 2],
        ],
      });
      break;
    case "Builder":
      Memory.TaskMan.Vat3.spawn.push({
        role: "Builder",
        task: "GET",
        body: [
          [WORK, 2],
          [CARRY, 1],
          [MOVE, 3],
        ],
        movePOS: { x: 8, y: 22, roomName: "E14N49" },
      });
      break;
    case "Upgrader":
      Memory.TaskMan.Vat2.spawn.push({
        role: "Upgrader",
        task: "MOVIN",
        body: [
          [WORK, 1],
          [CARRY, 1],
          [MOVE, 2],
        ],
        movePOS: { x: 36, y: 18, roomName: "E13N49" },
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
      Memory.TaskMan.Vat3.spawn.push({
        role: "upCarrier",
        body: [
          [CARRY, 5],
          [MOVE, 5],
        ],
      });
      break;
    case "Attacker":
      Memory.TaskMan.Vat3.spawn.push({
        role: "Attacker",
        body: [
          [TOUGH, 3],
          [WORK, 0],
          [ATTACK, 1],
          [CARRY, 0],
          [MOVE, 1],
        ],
        // task: "MOVIN",
        // roomPos: { x: 48, y: 25, roomName: "E9N54" },
        // break: "6453dd062dcf1466c079d6d8",
      });
      break;
    case "B1":
      Memory.TaskMan.Vat2.spawn.push({
        role: "Breaker",
        body: [
          [TOUGH, 6],
          [WORK, 6],
          [HEAL, 0],
          [CARRY, 0],
          [MOVE, 12],
        ],
        task: "MOVIN",
        roomPos: { x: 27, y: 46, roomName: "E9N55" },
        break: "645726bebc2f4b95ec1a04f1",
      });
      break;
    case "B2":
      Memory.TaskMan.Vat2.spawn.push({
        role: "Breaker",
        body: [
          [TOUGH, 6],
          [WORK, 6],
          [HEAL, 0],
          [CARRY, 0],
          [MOVE, 12],
        ],
        task: "MOVIN",
        roomPos: { x: 27, y: 46, roomName: "E9N55" },
        break: "645726bebc2f4b95ec1a04f1",
      });
      break;
    case "Blinker":
      Memory.TaskMan.Spawn1.spawn.push({
        role: "Blinker",
        body: [
          [TOUGH, 16],
          [WORK, 0],
          [HEAL, 4],
          [CARRY, 0],
          [MOVE, 22],
        ],
        task: "MOVIN",
        roomPos: { x: 48, y: 12, roomName: "E9N54" },
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
