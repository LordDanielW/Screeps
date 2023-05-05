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
];

module.exports.spawnList = spawnList;
