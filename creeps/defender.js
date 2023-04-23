// var roleUtilities = require("role.Utilities");
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
    TOUGH,
    TOUGH,
    TOUGH,
    TOUGH,
    ATTACK,
    ATTACK,
    ATTACK,
    ATTACK,
    CARRY,
    MOVE,
    MOVE,
    MOVE,
    MOVE,
    MOVE,
    MOVE,
    MOVE,
    MOVE,
  ],
  build: function (creepMem) {
    var newName = "Defender" + Memory.TaskMan.NameNum;
    Memory.TaskMan.NameNum++;
    return Game.spawns["BabyCakes"].spawnCreep(this.body, newName, {
      memory: { role: "Defender", task: "movin" },
    });
  },
};

module.exports.Defender = roleDefender;
