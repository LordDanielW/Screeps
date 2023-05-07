global.bCreep = function (spawnType) {
  switch (spawnType) {
    case "Signer":
      Memory.TaskMan.Vat2.spawn.push({
        role: "Signer",
        task: "MOVIN",
        say: 1,
        atDest: false,
        body: [
          [CLAIM, 1],
          [MOVE, 1],
        ],
        sitPOS: { x: 38, y: 19, roomName: "E13N49" },
      });
      break;
    case "Miner":
      Memory.TaskMan.Vat2.spawn.push({
        role: "Miner",
        task: "MOVIN",
        say: 2,
        atDest: false,
        sourceType: FIND_SOURCES,
        direction: BOTTOM_LEFT,
        body: [
          [WORK, 3],
          [MOVE, 3],
        ],
        sitPOS: { x: 38, y: 27, roomName: "E13N49" },
      });
      break;
    case "Carrier":
      Memory.TaskMan.Vat2.spawn.push({
        role: "Carrier",
        body: [
          [CARRY, 2],
          [MOVE, 2],
        ],
      });
      break;
    case "Builder":
      Memory.TaskMan.Vat2.spawn.push({
        role: "Builder",
        task: "GET",
        body: [
          [WORK, 2],
          [CARRY, 1],
          [MOVE, 2],
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
      Memory.TaskMan.Vat2.spawn.push({
        role: "Repair",
        body: [
          [WORK, 1],
          [CARRY, 1],
          [MOVE, 1],
        ],
      });
      break;
    case "upCarrier":
      Memory.TaskMan.Spawn1.spawn.push({
        role: "upCarrier",
        body: [
          [CARRY, 8],
          [MOVE, 4],
        ],
      });
      break;
    case "Breaker":
      Memory.TaskMan.Vat2.spawn.push({
        role: "Breaker",
        body: [
          [TOUGH, 0],
          [WORK, 2],
          [CARRY, 0],
          [MOVE, 2],
        ],
        task: "MOVIN",
        roomPos: { x: 48, y: 25, roomName: "E9N54" },
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

exports.bCreep = bCreep;
