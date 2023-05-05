//  run link transfer
//
runLinkerTransfer = function (theRoom) {
  var linkers = theRoom.find(FIND_STRUCTURES, {
    filter: (structure) => {
      return structure.structureType == STRUCTURE_LINK;
    },
  });
  var error = linkers[0].transferEnergy(linkers[1]);
  var error2 = linkers[2].transferEnergy(linkers[1]);
};

module.exports.runLinkerTransfer = runLinkerTransfer;
