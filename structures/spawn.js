//
//
//
var modSpawn = {
  //  Spawn Creeps
  //
  //
  addSpawnQue: function (roomNumber) {},

  //  more Creeps
  conditionalSpawnQue: function (roomNumber) {
    switch (ticks) {
      case 150:
        //  Check for Minerals
        if (
          Game.rooms[roomOne].find(FIND_MINERALS).length > 0 &&
          Game.rooms[roomOne].find(FIND_MINERALS)[0].mineralAmount > 0
        ) {
          addSpawn.push([
            roomOne,
            {
              role: "Miner",
              say: 1,
              atDest: false,
              sourceType: FIND_MINERALS,
              body: [
                [WORK, 15],
                [MOVE, 5],
              ],
              sitPOS: { x: 42, y: 39, roomName: roomOne },
              spawn: spawnName,
            },
          ]);
        }
        break;
      case 350:
        //  Check for Construction Sites
        let roomConstructionSites = false;
        Object.keys(Game.constructionSites).forEach((x) => {
          if (Game.constructionSites[x].room.name == roomOne) {
            roomConstructionSites = true;
            console.log("true");
            return;
          }
        });
        if (roomConstructionSites) {
          addSpawn.push([
            roomOne,
            {
              role: "Builder",
              body: [
                [WORK, 5],
                [CARRY, 2],
                [MOVE, 5],
              ],
              spawn: spawnName,
            },
          ]);
        }
        break;
    }
  },
};

module.exports.Spawn = modSpawn;
