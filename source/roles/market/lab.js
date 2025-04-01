//
//
//
var roleLab = {
  //Memory.TaskMan.E46N33.spawn.push({ Lab: { memory: { role: "Lab", task: "getTask", spawn: "Vat1", body: "body1" } } });
  /** @param {Creep} creep **/
  run: function (creep) {
    //creep.memory.task = "getFin";
    switch (creep.memory.task) {
      case "getTask":
        var factory = creep.room.find(FIND_STRUCTURES, {
          filter: (d) => {
            return d.structureType == STRUCTURE_FACTORY;
          },
        })[0];
        //Memory.Foo = creep.store.getUsedCapacity();
        if (creep.store.getUsedCapacity() != 0) {
          creep.memory.task = "Empty";
        } else if (creep.room.terminal.store[RESOURCE_ENERGY] < 5000) {
          creep.memory.task = "getEnergy";
        }
        //else if(factory.store[RESOURCE_ENERGY] < 1000) {creep.memory.task = "getBat";}
        else if (factory.store[RESOURCE_LEMERGIUM_BAR] > 200) {
          creep.memory.task = "getLegBar";
        } //_BAR
        else if (factory.store[RESOURCE_LEMERGIUM] < 1000) {
          creep.memory.task = "getLeg";
        }
        //else if(factory.store.lem)
        //else{creep.memory.task = "getEnergy";}
        break;

      case "Empty":
        if (utils.action.emptyCarry(creep)) {
          creep.memory.task = "getTask";
        }
        break;

      case "getBat":
        if (
          creep.withdraw(creep.room.storage, RESOURCE_ENERGY) ==
          ERR_NOT_IN_RANGE
        ) {
          creep.moveTo(creep.room.storage.pos, {
            visualizePathStyle: { stroke: "#00ffff" },
          });
        } else {
          creep.memory.task = "giveBat";
        }
        break;
      case "giveBat":
        var factory = creep.room.find(FIND_STRUCTURES, {
          filter: (d) => {
            return d.structureType == STRUCTURE_FACTORY;
          },
        })[0];
        //Memory.Foo = (factory.store.battery < 5000);
        if (creep.transfer(factory, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(factory, { visualizePathStyle: { stroke: "#00ffff" } });
        } else {
          creep.memory.task = "getTask";
        }
        break;

      case "getLeg":
        if (
          creep.withdraw(creep.room.terminal, RESOURCE_LEMERGIUM) ==
          ERR_NOT_IN_RANGE
        ) {
          creep.moveTo(creep.room.terminal.pos, {
            visualizePathStyle: { stroke: "#00ffff" },
          });
        } else {
          creep.memory.task = "giveLeg";
        }
        break;
      case "giveLeg":
        var factory = creep.room.find(FIND_STRUCTURES, {
          filter: (d) => {
            return d.structureType == STRUCTURE_FACTORY;
          },
        })[0];
        //Memory.Foo = (factory.store.battery < 5000);
        if (creep.transfer(factory, RESOURCE_LEMERGIUM) == ERR_NOT_IN_RANGE) {
          creep.moveTo(factory, { visualizePathStyle: { stroke: "#00ffff" } });
        } else {
          creep.memory.task = "getTask";
        }
        break;

      case "getLegBar":
        var factory = creep.room.find(FIND_STRUCTURES, {
          filter: (d) => {
            return d.structureType == STRUCTURE_FACTORY;
          },
        })[0];
        if (
          creep.withdraw(factory, RESOURCE_LEMERGIUM_BAR) == ERR_NOT_IN_RANGE
        ) {
          creep.moveTo(factory);
        } else {
          creep.memory.task = "giveLegBar";
        }
        break;
      case "giveLegBar":
        if (
          creep.transfer(creep.room.terminal, RESOURCE_LEMERGIUM_BAR) ==
          ERR_NOT_IN_RANGE
        ) {
          //_BAR
          creep.moveTo(creep.room.terminal);
        } else {
          creep.memory.task = "getTask";
        }
        break;
      case "getEnergy":
        if (
          creep.withdraw(creep.room.storage, RESOURCE_ENERGY) ==
          ERR_NOT_IN_RANGE
        ) {
          creep.moveTo(creep.room.storage.pos, {
            visualizePathStyle: { stroke: "#00ffff" },
          });
        } else {
          creep.memory.task = "giveEnergyTerminal";
        }
        break;
      //   var factory = creep.room.find(FIND_STRUCTURES, {filter: (d) =>{return(d.structureType == STRUCTURE_FACTORY);}})[0];
      //   if(creep.withdraw(factory, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
      //   {creep.moveTo(factory);}
      //   else{ creep.memory.task = "giveEnergyTerminal"; }
      //  break;
      case "giveEnergyLink":
        var DestID = creep.pos.findClosestByRange(FIND_STRUCTURES, {
          filter: (structure) => {
            return structure.structureType == STRUCTURE_LINK;
          },
        });
        if (creep.transfer(DestID, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(DestID, { visualizePathStyle: { stroke: "#00ffff" } });
        } else {
          creep.memory.task = "getTask";
        }
        break;
      case "giveEnergyTerminal":
        if (
          creep.transfer(creep.room.terminal, RESOURCE_ENERGY) ==
          ERR_NOT_IN_RANGE
        ) {
          creep.moveTo(creep.room.terminal, {
            visualizePathStyle: { stroke: "#00ffff" },
          });
        } else {
          creep.memory.task = "getTask";
        }
        break;
      default:
        creep.memory.task = "getTask";
        break;
    }
  },
  body: [
    [CARRY, 4],
    [MOVE, 2],
  ],
};

module.exports.Lab = roleLab;
