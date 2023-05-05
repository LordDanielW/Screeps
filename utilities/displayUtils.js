//  Structure Message
//
//
structureMessage = function (structureId, message) {
  let structure = Game.getObjectById(structureId);
  structure.pos.x += 1;
  structure.room.visual.text(message, structure.pos, {
    align: "left",
    opacity: 0.8,
  });
};

module.exports.structureMessage = structureMessage;

//  Display Attack Rings
//
//
displayAttackRings = function (aRoom, aTower) {
  aRoom.visual.circle(aTower.pos.x, aTower.pos.y, {
    fill: "transparent",
    stroke: "red",
    strokeWidth: 0.1,
    radius: 5,
  });
  aRoom.visual.circle(aTower.pos.x, aTower.pos.y, {
    fill: "transparent",
    stroke: "yellow",
    strokeWidth: 0.1,
    radius: 10,
  });
  return aRoom.visual.circle(aTower.pos.x, aTower.pos.y, {
    fill: "transparent",
    stroke: "blue",
    strokeWidth: 0.1,
    radius: 20,
  });
};

module.exports.displayAttackRings = displayAttackRings;

//
//
//
spawnTracking = function (room, visualFlag = false) {
  if (!Memory.spawnTracking) {
    Memory.spawnTracking = {};
  }

  let yOffset = 2;
  let spawners = room.find(FIND_MY_SPAWNS);
  let totalRoomUtilization = 0;
  for (let i = 0; i < spawners.length; i++) {
    if (!Memory.spawnTracking[spawners[i].id]) {
      Memory.spawnTracking[spawners[i].id] = [];
    }

    let log = Memory.spawnTracking[spawners[i].id];
    //remove old logs

    if (log.length > 0 && Game.time - log[0].tick > 1500) {
      log.shift();
    }

    if (
      spawners[i].spawning &&
      spawners[i].spawning.needTime - 1 === spawners[i].spawning.remainingTime
    ) {
      let spawnLog = {};
      spawnLog.name = spawners[i].spawning.name;
      spawnLog.duration = spawners[i].spawning.needTime;
      spawnLog.tick = Game.time;
      Memory.spawnTracking[spawners[i].id].push(spawnLog);
    }

    //visuals
    //if(visualFlag)
    {
      let colors = ["red", "blue", "green"];
      let colorIndex = 0;
      let totalUtilization = 0;
      for (let i = 0; i < log.length; i++) {
        totalUtilization += log[i].duration / 3;
        let xOffset = Math.round(49 - (Game.time - log[i].tick) / 3);
        let xWidth = Math.round(log[i].duration / 3);

        if (visualFlag) {
          room.visual.rect(xOffset, 49 - yOffset, xWidth, 1, {
            fill: colors[colorIndex++],
          });
        }
        if (visualFlag) {
          room.visual.text(
            log[i].name,
            xOffset + Math.round(xWidth / 2),
            49 - yOffset,
            { font: 1 }
          );
        }
        if (colorIndex > colors.length) {
          colorIndex = 0;
        }

        if (xOffset + xWidth > 50) {
          break;
        }
      }
      totalRoomUtilization += totalUtilization;
      if (visualFlag) {
        room.visual.text(
          totalUtilization,
          spawners[i].pos.x,
          spawners[i].pos.y,
          { font: 0.35, color: "black" }
        );
      }
    }
    yOffset += 2;
  }

  if (typeof room.memory.spawnCapacityTracking === "undefined") {
    room.memory.spawnCapacityTracking = { utilization: 0, capacity: 500 };
  }
  //TODO:may want to add filtration here to make values more stable.
  let spawnTrackingStub = {};
  spawnTrackingStub.utilization =
    (95 * room.memory.spawnCapacityTracking.utilization +
      5 * totalRoomUtilization) /
    100;
  spawnTrackingStub.capacity = 500 * spawners.length;
  room.memory.spawnCapacityTracking = spawnTrackingStub;

  //if(visualFlag)
  {
    Game.map.visual.text(
      Math.round(room.memory.spawnCapacityTracking.utilization) +
        " / " +
        500 * spawners.length,
      new RoomPosition(25, 25, room.name)
    );
  }
};
