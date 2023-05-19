//  Room
//
runRoom = function (theRoom) {
  let linkFrom = null;
  let linkTo = null;

  if (Memory.TaskMan[theRoom].linkFrom) {
    linkFrom = Game.getObjectById(Memory.TaskMan[theRoom].linkFrom);
  }
  if (Memory.TaskMan[theRoom].linkTo) {
    linkTo = Game.getObjectById(Memory.TaskMan[theRoom].linkTo);
  }

  if (linkFrom && linkTo) {
    if (linkFrom.store.getUsedCapacity(RESOURCE_ENERGY) >= 500) {
      linkFrom.transferEnergy(linkTo);
    }
  }
};

module.exports.runRoom = runRoom;
