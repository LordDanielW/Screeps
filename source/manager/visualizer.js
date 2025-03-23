module.exports = {
  render: function () {
    for (const roomName in Game.rooms) {
      const room = Game.rooms[roomName];
      if (room.controller && room.controller.my) {
        this.renderRoomStats(room);
      }
    }
  },

  renderRoomStats: function (room) {
    const visual = room.visual;
    const stats = Memory.speedRun.stats;

    // Display run information
    visual.text(`Tick: ${Game.time}`, 1, 1, { align: "left", font: 0.8 });
    visual.text(
      `Total Runtime: ${Game.time - Memory.speedRun.startTick}`,
      1,
      2,
      { align: "left", font: 0.8 }
    );

    // Display energy metrics
    visual.text(`Energy Mined: ${stats.energyMined}`, 1, 3.5, {
      align: "left",
      font: 0.7,
    });
    visual.text(`Energy Used: ${stats.energyUsed}`, 1, 4.5, {
      align: "left",
      font: 0.7,
    });

    // Idle stats
    const idleCreeps = Object.keys(Game.creeps).filter(
      (name) => Game.creeps[name].memory.idle === true
    ).length;

    visual.text(`Creeps Idle: ${idleCreeps}`, 1, 6, {
      align: "left",
      font: 0.7,
    });

    // Spawn idle time
    const spawn = room.find(FIND_MY_SPAWNS)[0];
    visual.text(`Spawn Idle: ${spawn.spawning ? "No" : "Yes"}`, 1, 7, {
      align: "left",
      font: 0.7,
    });

    // Current phase information
    const cycleManager = require("./cycle");
    visual.text(`Cycle Phase: ${cycleManager.getCurrentPhase()}`, 1, 8.5, {
      align: "left",
      font: 0.7,
    });
    visual.text(
      `Phase Progress: ${cycleManager.getElapsedInPhase()}/${
        cycleManager.CYCLE_LENGTH
      }`,
      1,
      9.5,
      { align: "left", font: 0.7 }
    );

    // Controller progress
    const controller = room.controller;
    const progress = controller.progress;
    const total = controller.progressTotal;
    const percentage = Math.floor((progress / total) * 100);

    visual.text(
      `RCL ${controller.level}: ${percentage}% (${progress}/${total})`,
      1,
      11,
      { align: "left", font: 0.7 }
    );
  },
};
