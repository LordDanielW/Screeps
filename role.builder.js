var roleUtilities = require('role.Utilities');
var roleBuilder = {

	/** @param {Creep} creep **/
	run: function (creep) {
//creep.memory.moveTO = { x: 24, y: 47, roomName: "W16N39"};
		if (creep.carry.energy == 0 && creep.memory.task == 'build') {
			creep.memory.task = 'get';
			creep.say('🔄 get', true);
		}
		if (creep.memory.task == 'get' && creep.carry.energy == creep.carryCapacity) {
			creep.memory.task = 'build';
			creep.say('🚧 build', true);
		}

		if (creep.memory.task == 'build') {
			var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
			if (targets.length) {
				var target = creep.pos.findClosestByPath(targets);
				if (creep.build(target) == ERR_NOT_IN_RANGE) {
					creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
				}			
			}	else {
				creep.memory.task = 'movin';
				creep.say('🍄 Movin', true);				
			}
		} else if(creep.memory.task == 'movin'){

			var mPOS = creep.memory.moveTO;
      var moveTO = new RoomPosition(mPOS.x, mPOS.y, mPOS.roomName);
			//var nextRoom = new RoomPosition(6, 17, "W16N38");
			if (creep.pos.isEqualTo(moveTO)) {
				creep.memory.task = 'build';
				creep.say('🚧 build', true);
			}else {
				//  creep.say(creep.memory.dest.x + ',' + creep.memory.dest.y);
				creep.moveTo(moveTO, { visualizePathStyle: { stroke: '#ffaa00' } });
				//roleUtilities.moveRooms(creep);			
			}
		} else{
			//if(!(roleUtilities.getEnergyLink(creep, 1))){
				roleUtilities.getEnergyHarvest(creep);
			//}
		}
	},
	body: [MOVE, WORK, CARRY],//MOVE, WORK, CARRY, MOVE],
	build: function (creepMem) {
    var newName = 'Builder' + Memory.TaskMan.NameNum;
    Memory.TaskMan.NameNum++;
    return Game.spawns[creepMem.memory.spawn].spawnCreep(this.body, newName, creepMem);
  }

};

module.exports = roleBuilder;

// Memory.TaskMan.W17N38.spawn.queue.push({
//   Builder: {
//     memory: {
//       role: 'Builder', moveTO: { x: 24, y: 47, roomName: "W16N39"}, task:'movin'
//     }
//   }
// });