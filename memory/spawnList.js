//
//
//
var spawnList = {
  Spawn1: [
    {
      role: "Carrier",
      body: [
        [CARRY, 10],
        [MOVE, 5],
      ],
    },
    {
      role: "Miner",
      say: 1,
      atDest: false,
      sourceType: FIND_SOURCES,
      body: [
        [WORK, 5],
        [MOVE, 1],
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
        [MOVE, 1],
      ],
      sitPOS: { x: 23, y: 36, roomName: "E9N52" },
    },
    {
      role: "Repair",
      body: [
        [WORK, 4],
        [CARRY, 2],
        [MOVE, 3],
      ],
    },
    {
      role: "upCarrier",
      body: [
        [CARRY, 10],
        [MOVE, 5],
      ],
    },
    {
      role: "Upgrader",
      body: [
        [WORK, 16],
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
        [WORK, 6],
        [CARRY, 4],
        [MOVE, 5],
      ],
    },
    // {
    //   role: "Upgrader",
    //   direction: BOTTOM_RIGHT,
    //   body: [
    //     [WORK, 6],
    //     [CARRY, 4],
    //     [MOVE, 5],
    //   ],
    // },
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
        [CARRY, 2],
        [MOVE, 1],
      ],
    },
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
        [MOVE, 3],
      ],
      sitPOS: { x: 28, y: 43, roomName: "E13N49" },
    },
    {
      role: "Upgrader",
      direction: BOTTOM_RIGHT,
      body: [
        [WORK, 7],
        [CARRY, 1],
        [MOVE, 1],
      ],
    },
    {
      role: "Upgrader",
      direction: BOTTOM_RIGHT,
      body: [
        [WORK, 7],
        [CARRY, 1],
        [MOVE, 1],
      ],
    },
    {
      role: "Upgrader",
      direction: BOTTOM_RIGHT,
      body: [
        [WORK, 7],
        [CARRY, 1],
        [MOVE, 1],
      ],
    },
    {
      role: "Linker",
      body: [
        [CARRY, 1],
        [MOVE, 1],
      ],
    },
    {
      role: "upCarrier",
      body: [
        [CARRY, 8],
        [MOVE, 4],
      ],
    },
    {
      role: "Repair",
      body: [
        [WORK, 6],
        [CARRY, 4],
        [MOVE, 5],
      ],
    },
  ],
  Vat4: [
    {
      role: "Carrier",
      body: [
        [CARRY, 4],
        [MOVE, 2],
      ],
    },
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
      direction: BOTTOM,
      sourceType: FIND_SOURCES,
      body: [
        [WORK, 5],
        [MOVE, 1],
      ],
      sitPOS: { x: 16, y: 8, roomName: "E14N49" },
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
      sitPOS: { x: 34, y: 5, roomName: "E14N49" },
    },
    {
      role: "Upgrader",
      direction: BOTTOM_RIGHT,
      body: [
        [WORK, 6],
        [CARRY, 1],
        [MOVE, 2],
      ],
    },
    {
      role: "Upgrader",
      direction: BOTTOM_RIGHT,
      body: [
        [WORK, 6],
        [CARRY, 1],
        [MOVE, 2],
      ],
    },
    {
      role: "Upgrader",
      direction: BOTTOM_RIGHT,
      body: [
        [WORK, 6],
        [CARRY, 1],
        [MOVE, 2],
      ],
    },
    {
      role: "Linker",
      body: [
        [CARRY, 1],
        [MOVE, 1],
      ],
    },
    {
      role: "Repair",
      body: [
        [WORK, 2],
        [CARRY, 2],
        [MOVE, 2],
      ],
    },
    {
      role: "upCarrier",
      body: [
        [CARRY, 6],
        [MOVE, 3],
      ],
    },
    // {
    //   role: "Builder",
    //   body: [
    //     [WORK, 2],
    //     [CARRY, 2],
    //     [MOVE, 2],
    //   ],
    // },
  ],
};

module.exports.spawnList = spawnList;
