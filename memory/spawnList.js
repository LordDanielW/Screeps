//
//
//
var spawnList = [
  {
    role: "Carrier",
    body: [
      [CARRY, 8],
      [MOVE, 4],
    ],
    spawn: spawnName,
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
    sitPOS: { x: 15, y: 31, roomName: roomOne },
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
    sitPOS: { x: 23, y: 36, roomName: roomOne },
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
  {
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
  },
];

module.exports = spawnList;
