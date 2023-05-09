global.sC = function (spawnType) {
  switch (spawnType) {
    case "Signer":
      Memory.TaskMan.Vat3.spawn.push({
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
      Memory.TaskMan.Vat2.spawn.push({
        role: "Miner",
        task: "GET",
        say: 2,
        atDest: false,
        sourceType: FIND_SOURCES,
        direction: BOTTOM_LEFT,
        body: [
          [WORK, 2],
          [MOVE, 1],
        ],
        sitPOS: { x: 3, y: 33, roomName: "E11N51" },
      });
      break;
    case "Carrier":
      Memory.TaskMan.Vat2.spawn.push({
        role: "Carrier",
        body: [
          [CARRY, 1],
          [MOVE, 1],
        ],
      });
      break;
    case "Builder":
      Memory.TaskMan.Vat2.spawn.push({
        role: "Builder",
        task: "GET",
        body: [
          [WORK, 3],
          [CARRY, 1],
          [MOVE, 3],
        ],
        movePOS: { x: 36, y: 18, roomName: "E13N49" },
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
      Memory.TaskMan.Vat2.spawn.push({
        role: "Attacker",
        body: [
          [TOUGH, 0],
          [WORK, 0],
          [ATTACK, 4],
          [CARRY, 0],
          [MOVE, 4],
        ],
        task: "MOVIN",
        roomPos: { x: 48, y: 25, roomName: "E9N54" },
        break: "6453dd062dcf1466c079d6d8",
      });
      break;
    case "Blinker":
      Memory.TaskMan.Vat2.spawn.push({
        role: "Breaker",
        body: [
          [TOUGH, 13],
          [HEAL, 2],
          [CARRY, 0],
          [MOVE, 13],
        ],
        task: "MOVIN",
        roomPos: { x: 49, y: 13, roomName: "E9N54" },
        break: "6453dd062dcf1466c079d6d8",
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
        roomPos: { x: 1, y: 12, roomName: "E10N54" },
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

// Pick Creep function
global.pC = function (creepName) {
  if (typeof creepName === "string") {
    Memory.selectCreep = creepName;
    // return if creepName is in Game.creeps
    return Game.creeps[creepName] != undefined;
  } else if (typeof creepName === "number") {
  }
};
exports.pC = pC;

// Move Creep function
global.mC = function (moveString) {
  Memory.creepMove = moveString;
};
exports.mC = mC;

// Move Creep function
moveCreep = function (creep) {
  if (Memory.creepMove && Memory.creepMove.length > 0) {
    // get first charcter of creepMove
    var move = Memory.creepMove.charAt(0);

    let resp = "none";
    switch (move) {
      // move creep up
      case "w":
        resp = creep.move(TOP);
        break;
      // move creep down
      case "x":
        resp = creep.move(BOTTOM);
        break;
      // move creep left
      case "a":
        resp = creep.move(LEFT);
        break;
      // move creep right
      case "d":
        resp = creep.move(RIGHT);
        break;
      // move creep up and left
      case "q":
        resp = creep.move(TOP_LEFT);
        break;
      // move creep up and right
      case "e":
        resp = creep.move(TOP_RIGHT);
        break;
      // move creep down and left
      case "z":
        resp = creep.move(BOTTOM_LEFT);
        break;
      // move creep down and right
      case "c":
        resp = creep.move(BOTTOM_RIGHT);
        break;
    }
    // creep.say(resp);
    // remove first character of creepMove
    if (resp == OK) {
      Memory.creepMove = Memory.creepMove.substring(1);
    }
  }
};
exports.moveCreep = moveCreep;
