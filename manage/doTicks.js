//  Do Ticks
//
//
var doTicks = function () {
  Memory.Tick++;

  if (Memory.Tick >= 1460) {
    Memory.Tick = 0;
    Memory.TaskMan.Spawn1.spawn = [];
    Memory.TaskMan.Spawn1.spawnListNumber = 0;
    Memory.TaskMan.Vat2.spawn = [];
    Memory.TaskMan.Vat2.spawnListNumber = 0;
    Memory.TaskMan.Vat3.spawn = [];
    Memory.TaskMan.Vat3.spawnListNumber = 0;
    Memory.TaskMan.Vat4.spawn = [];
    Memory.TaskMan.Vat4.spawnListNumber = 0;
  }

  // var roomOne = "E9N52";
  // var spawnName = "Spawn1";
  // //  Memory.TaskMan.E9N52.spawn.push({ role: '' });
  // //  Miner  Carrier  Builder  Upgrader  Repair upCarrier

  // let addSpawn = [];
  // switch (ticks) {
  //   case 1:
  //     addSpawn.push([
  //       roomOne,
  //       {
  //         role: "Carrier",
  //         body: [
  //           [CARRY, 8],
  //           [MOVE, 4],
  //         ],
  //         spawn: spawnName,
  //       },
  //     ]);
  //     break;
  //   case 150:
  //     //
  //     if (
  //       Game.rooms[roomOne].find(FIND_MINERALS).length > 0 &&
  //       Game.rooms[roomOne].find(FIND_MINERALS)[0].mineralAmount > 0
  //     ) {
  //       addSpawn.push([
  //         roomOne,
  //         {
  //           role: "Miner",
  //           say: 1,
  //           atDest: false,
  //           sourceType: FIND_MINERALS,
  //           body: [
  //             [WORK, 15],
  //             [MOVE, 5],
  //           ],
  //           sitPOS: { x: 42, y: 39, roomName: roomOne },
  //           spawn: spawnName,
  //         },
  //       ]);
  //     }
  //     break;
  //   case 250:
  //     addSpawn.push([
  //       roomOne,
  //       {
  //         role: "Miner",
  //         say: 1,
  //         atDest: false,
  //         sourceType: FIND_SOURCES,
  //         body: [
  //           [WORK, 5],
  //           [MOVE, 2],
  //         ],
  //         sitPOS: { x: 15, y: 31, roomName: roomOne },
  //         spawn: spawnName,
  //       },
  //     ]);
  //     break;
  //   case 350:
  //     //  Check for Construction Sites
  //     let roomConstructionSites = false;
  //     Object.keys(Game.constructionSites).forEach((x) => {
  //       if (Game.constructionSites[x].room.name == roomOne) {
  //         roomConstructionSites = true;
  //         console.log("true");
  //         return;
  //       }
  //     });
  //     if (roomConstructionSites) {
  //       addSpawn.push([
  //         roomOne,
  //         {
  //           role: "Builder",
  //           body: [
  //             [WORK, 5],
  //             [CARRY, 2],
  //             [MOVE, 5],
  //           ],
  //           spawn: spawnName,
  //         },
  //       ]);
  //     }
  //     break;
  //   case 400:
  //     addSpawn.push([
  //       roomOne,
  //       {
  //         role: "Miner",
  //         say: 6,
  //         atDest: false,
  //         sourceType: FIND_SOURCES,
  //         body: [
  //           [WORK, 5],
  //           [MOVE, 2],
  //         ],
  //         sitPOS: { x: 23, y: 36, roomName: roomOne },
  //         spawn: spawnName,
  //       },
  //     ]);
  //     break;
  //   case 550:
  //     addSpawn.push([
  //       roomOne,
  //       {
  //         role: "Repair",
  //         body: [
  //           [WORK, 4],
  //           [CARRY, 2],
  //           [MOVE, 4],
  //         ],
  //         spawn: spawnName,
  //       },
  //     ]);
  //     break;
  //   case 650:
  //     addSpawn.push([
  //       roomOne,
  //       {
  //         role: "upCarrier",
  //         body: [
  //           [CARRY, 5],
  //           [MOVE, 3],
  //         ],
  //         spawn: spawnName,
  //       },
  //     ]);
  //     break;
  //   case 850:
  //     addSpawn.push([
  //       roomOne,
  //       {
  //         role: "Upgrader",
  //         body: [
  //           [WORK, 10],
  //           [CARRY, 2],
  //           [MOVE, 4],
  //         ],
  //         iStore: 2,
  //       },
  //     ]);
  //     break;
  //   // case 1250:
  //   //   addSpawn.push([
  //   //     roomOne,
  //   //     {
  //   //       role: "Breaker",
  //   //       body: [
  //   //         [TOUGH, 0],
  //   //         [WORK, 2],
  //   //         [CARRY, 0],
  //   //         [MOVE, 2],
  //   //       ],
  //   //       task: "MOVIN",
  //   //       roomPos: { x: 48, y: 25, roomName: "E9N54" },
  //   //       break: "6453dd062dcf1466c079d6d8",
  //   //     },
  //   //   ]);
  //   //   break;
  // }

  // // Move Added Spawns from local to remote Memory
  // for (let i = 0; i < addSpawn.length; i++) {
  //   Memory.TaskMan[addSpawn[i][0]].spawn.push(addSpawn[i][1]);
  // }
};

module.exports.doTicks = doTicks;
