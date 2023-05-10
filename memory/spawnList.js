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
        [CARRY, 7],
        [MOVE, 4],
      ],
    },
    {
      role: "Upgrader",
      body: [
        [WORK, 15],
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
      atDest: false,
      direction: BOTTOM,
      sourceType: FIND_SOURCES,
      body: [
        [WORK, 5],
        [MOVE, 1],
      ],
      sitPOS: { x: 3, y: 33, roomName: "E11N51" },
    },
    {
      role: "Upgrader",
      direction: BOTTOM_RIGHT,
      body: [
        [WORK, 5],
        [CARRY, 1],
        [MOVE, 1],
      ],
      iStore: 2,
    },
    {
      role: "Repair",
      body: [
        [WORK, 2],
        [CARRY, 1],
        [MOVE, 2],
      ],
    },
  ],
  Vat3: [
    {
      role: "Carrier",
      body: [
        [CARRY, 3],
        [MOVE, 3],
      ],
    },
    {
      role: "Miner",
      say: 1,
      atDest: false,
      direction: BOTTOM,
      sourceType: FIND_SOURCES,
      body: [
        [WORK, 5],
        [MOVE, 1],
      ],
      sitPOS: { x: 38, y: 27, roomName: "E13N49" },
    },
    {
      role: "Miner",
      say: 2,
      atDest: false,
      direction: BOTTOM,
      sourceType: FIND_SOURCES,
      body: [
        [WORK, 5],
        [MOVE, 1],
      ],
      sitPOS: { x: 28, y: 43, roomName: "E13N49" },
    },
    {
      role: "Carrier",
      body: [
        [CARRY, 3],
        [MOVE, 3],
      ],
    },
    {
      role: "Upgrader",
      direction: BOTTOM_RIGHT,
      body: [
        [WORK, 4],
        [CARRY, 1],
        [MOVE, 1],
      ],
      iStore: 2,
    },
    {
      role: "Upgrader",
      direction: BOTTOM_RIGHT,
      body: [
        [WORK, 4],
        [CARRY, 1],
        [MOVE, 1],
      ],
      iStore: 2,
    },
    {
      role: "Upgrader",
      direction: BOTTOM_RIGHT,
      body: [
        [WORK, 4],
        [CARRY, 1],
        [MOVE, 1],
      ],
      iStore: 2,
    },
    {
      role: "upCarrier",
      body: [
        [CARRY, 5],
        [MOVE, 5],
      ],
    },
    {
      role: "upCarrier",
      body: [
        [CARRY, 5],
        [MOVE, 5],
      ],
    },
    {
      role: "Repair",
      body: [
        [WORK, 2],
        [CARRY, 1],
        [MOVE, 2],
      ],
    },
    {
      role: "Repair",
      body: [
        [WORK, 2],
        [CARRY, 1],
        [MOVE, 2],
      ],
    },
    // Remote Room E14N49
    //
    {
      role: "Miner",
      say: 1,
      atDest: false,
      direction: BOTTOM,
      sourceType: FIND_SOURCES,
      body: [
        [WORK, 5],
        [MOVE, 1],
      ],
      sitPOS: { x: 16, y: 8, roomName: "E14N49" },
    },
    {
      role: "Builder",
      task: "MOVIN",
      body: [
        [WORK, 2],
        [CARRY, 2],
        [MOVE, 4],
      ],
      movePOS: { x: 1, y: 24, roomName: "E14N49" },
    },
    {
      role: "Builder",
      task: "MOVIN",
      body: [
        [WORK, 2],
        [CARRY, 2],
        [MOVE, 4],
      ],
      movePOS: { x: 1, y: 24, roomName: "E14N49" },
    },
    {
      role: "Upgrader",
      task: "MOVIN",
      direction: BOTTOM_RIGHT,
      body: [
        [WORK, 2],
        [CARRY, 2],
        [MOVE, 4],
      ],
      iStore: 2,
      movePOS: { x: 1, y: 24, roomName: "E14N49" },
    },
  ],
  Vat4: [
    {
      role: "Carrier",
      body: [
        [CARRY, 1],
        [MOVE, 1],
      ],
    },
    {
      role: "Upgrader",
      direction: BOTTOM_RIGHT,
      body: [
        [WORK, 2],
        [CARRY, 1],
        [MOVE, 3],
      ],
      iStore: 2,
    },
  ],
};

module.exports.spawnList = spawnList;
