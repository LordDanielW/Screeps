//
//
//
var spawnList = {
  Spawn1: [
    {
      role: "Carrier",
      body: [
        [CARRY, 8],
        [MOVE, 4],
      ],
    },
    {
      role: "Miner",
      say: 1,
      atDest: false,
      sourceType: FIND_SOURCES,
      body: [
        [WORK, 5],
        [MOVE, 2],
      ],
      sitPOS: { x: 15, y: 31, roomName: "E9N52" },
    },
    {
      role: "Miner",
      say: 6,
      atDest: false,
      sourceType: FIND_SOURCES,
      body: [
        [WORK, 5],
        [MOVE, 2],
      ],
      sitPOS: { x: 23, y: 36, roomName: "E9N52" },
    },
    {
      role: "Repair",
      body: [
        [WORK, 5],
        [CARRY, 2],
        [MOVE, 5],
      ],
    },
    {
      role: "upCarrier",
      body: [
        [CARRY, 6],
        [MOVE, 3],
      ],
    },
    {
      role: "Upgrader",
      body: [
        [WORK, 12],
        [CARRY, 2],
        [MOVE, 4],
      ],
      iStore: 2,
    },
  ],
  Vat2: [
    {
      role: "Carrier",
      body: [
        [CARRY, 2],
        [MOVE, 1],
      ],
    },
    {
      role: "Miner",
      say: 1,
      atDest: true,
      direction: BOTTOM,
      sourceType: FIND_SOURCES,
      body: [
        [WORK, 2],
        [MOVE, 1],
      ],
      sitPOS: { x: 3, y: 33, roomName: "E11N51" },
    },
    {
      role: "Upgrader",
      direction: BOTTOM_RIGHT,
      body: [
        [WORK, 2],
        [CARRY, 1],
        [MOVE, 1],
      ],
      iStore: 2,
    },
  ],
};

module.exports.spawnList = spawnList;
