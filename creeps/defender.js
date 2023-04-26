//
//
//
var roleDefender = {
  /** @param {Creep} creep **/
  run: function (creep) {
    if (creep.memory.task == "movin") {
      var nextRoom = new RoomPosition(02, 17, "W16N38");
      if (creep.pos.isEqualTo(nextRoom)) {
        creep.memory.task = "attack";
      } else {
        creep.moveTo(nextRoom);
      }
      const target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
      if (target) {
        creep.say("💣 allahu akbar", true);
        if (creep.attack(target) == ERR_NOT_IN_RANGE) {
          creep.moveTo(target);
        }
      }
    }
  },
  body: [
    [TOUGH, 4],
    [ATTACK, 4],
    [CARRY, 1],
    [MOVE, 8],
  ],
};

module.exports.Defender = roleDefender;
