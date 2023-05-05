TaskMan = {
  Tick: 1,
  NameNum: 1,
  E9N52: {
    sourceContainers: ["6444fc8e758fbdce3b725bbb", "64450bc42f446e38bfca900a"],
    upgradeContainer: "6445761e9ab55f36918b58ee",
    wallHealth: 20000,
  },
  Spawn1: {
    spawn: [],
    spawnListNumber: -1,
    spawnExtrasNumber: -1,
  },
};

global.createCreeps = function (spawnType) {
  switch (spawnType) {
    case "Signer":
      Memory.TaskMan.Spawn1.spawn.push({
        role: "Signer",
        say: 1,
        atDest: false,
        body: [
          [CLAIM, 1],
          [MOVE, 1],
        ],
        sitPOS: { x: 7, y: 36, roomName: "E11N51" },
      });
      break;
    case "Miner":
      Memory.TaskMan.Spawn1.spawn.push({
        role: "Miner",
        say: 2,
        atDest: false,
        sourceType: FIND_SOURCES,
        body: [
          [WORK, 1],
          [MOVE, 1],
        ],
        sitPOS: { x: 3, y: 33, roomName: "E11N51" },
      });
      break;
    case "Carrier":
      Memory.TaskMan.Spawn1.spawn.push({
        role: "Carrier",
        body: [
          [CARRY, 8],
          [MOVE, 4],
        ],
      });
      break;
    case "Builder":
      Memory.TaskMan.Spawn1.spawn.push({
        role: "Builder",
        task: "MOVIN",
        body: [
          [WORK, 1],
          [CARRY, 1],
          [MOVE, 2],
        ],
        movePOS: { x: 5, y: 22, roomName: "E11N51" },
      });
      break;
    case "Upgrader":
      Memory.TaskMan.Spawn1.spawn.push({
        role: "Upgrader",
        body: [
          [WORK, 1],
          [CARRY, 1],
          [MOVE, 2],
        ],
        movePOS: { x: 5, y: 22, roomName: "E11N51" },
      });
      break;
    case "Repair":
      Memory.TaskMan.Spawn1.spawn.push({
        role: "Repair",
        body: [
          [WORK, 5],
          [CARRY, 5],
          [MOVE, 5],
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
      Memory.TaskMan.Spawn1.spawn.push({
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

exports.createCreeps = createCreeps;

// module.exports = memTaskMan;

//  Create a sell order
//

// Game.market.createOrder({
//     type: ORDER_SELL,
//     resourceType: RESOURCE_LEMERGIUM_BAR,
//     price: 0.42,
//     totalAmount: 100,
//     roomName: "E9N52"
// });

// Buy

//Game.market.deal('5e3de0140b8ac40851953ac8', 6000, "E46N33");

// Game.rooms['E46N33'].terminal.send(RESOURCE_LEMERGIUM_BAR, 1000, 'E44N31',
//     'PEN15');
