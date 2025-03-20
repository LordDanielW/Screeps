// run factory
//
runFatcory = function (theRoom) {
  var factory = theRoom.find(FIND_STRUCTURES, {
    filter: (structure) => {
      return structure.structureType == STRUCTURE_FACTORY;
    },
  })[0];
  if (factory.cooldown == 0) {
    factory.produce(RESOURCE_LEMERGIUM_BAR);
    if (factory.store.energy == null || factory.store.energy < 5000) {
      factory.produce(RESOURCE_ENERGY);
    } else {
      factory.produce(RESOURCE_LEMERGIUM_BAR);
    }
  }
};

module.exports.runFatcory = runFatcory;
