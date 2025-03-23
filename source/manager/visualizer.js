module.exports = {
  render: function () {
    for (const roomName in Game.rooms) {
      const room = Game.rooms[roomName];
      if (room.controller && room.controller.my) {
        this.renderRoomStats(room);
        this.renderCreepStats(room);
        this.renderEnergyFlow(room);
      }
    }
  },

  renderRoomStats: function (room) {
    const visual = room.visual;
    const stats = Memory.speedRun.stats;

    // Draw a semi-transparent background for the stats
    visual.rect(0, 0, 15, 12, { fill: "rgba(0,0,0,0.5)", opacity: 0.5 });

    // Display run information
    visual.text(
      `TICKS: ${Game.time - Memory.speedRun.startTick}/${9000}`,
      1,
      1,
      {
        align: "left",
        font: 0.8,
        color: "rgba(255,255,255,0.8)",
      }
    );

    // Display energy metrics
    visual.text(`ENERGY MINED: ${stats.energyMined}`, 1, 2.5, {
      align: "left",
      font: 0.7,
      color: "rgba(255,255,0,0.8)",
    });

    visual.text(`ENERGY USED: ${stats.energyUsed}`, 1, 3.5, {
      align: "left",
      font: 0.7,
      color: "rgba(255,150,0,0.8)",
    });

    // Idle stats
    const idleCreeps = Object.keys(Game.creeps).filter(
      (name) =>
        Game.creeps[name].memory.idle === true &&
        Game.creeps[name].room.name === room.name
    ).length;

    visual.text(`CREEPS IDLE: ${idleCreeps}`, 1, 5, {
      align: "left",
      font: 0.7,
      color: "rgba(255,100,100,0.8)",
    });

    // Spawn idle time
    const spawn = room.find(FIND_MY_SPAWNS)[0];
    visual.text(`SPAWN IDLE: ${spawn.spawning ? "No" : "Yes"}`, 1, 6, {
      align: "left",
      font: 0.7,
      color: spawn.spawning ? "rgba(100,255,100,0.8)" : "rgba(255,100,100,0.8)",
    });

    // Current phase information
    const cycleManager = require("./cycle");
    visual.text(`CYCLE PHASE: ${cycleManager.getCurrentPhase()}`, 1, 7.5, {
      align: "left",
      font: 0.7,
      color: "rgba(100,100,255,0.8)",
    });

    visual.text(
      `PHASE PROGRESS: ${cycleManager.getElapsedInPhase()}/${
        cycleManager.CYCLE_LENGTH
      }`,
      1,
      8.5,
      {
        align: "left",
        font: 0.7,
        color: "rgba(100,100,255,0.8)",
      }
    );

    // Controller progress
    const controller = room.controller;
    const progress = controller.progress;
    const total = controller.progressTotal;
    const percentage = Math.floor((progress / total) * 100);

    // Draw a progress bar
    visual.rect(1, 10, 10, 0.6, { fill: "rgba(50,50,50,0.8)" });
    visual.rect(1, 10, 10 * (progress / total), 0.6, {
      fill: "rgba(0,255,0,0.8)",
    });

    visual.text(`RCL ${controller.level}: ${percentage}%`, 1, 11, {
      align: "left",
      font: 0.7,
      color: "rgba(255,255,255,0.8)",
    });
  },

  renderCreepStats: function (room) {
    const visual = room.visual;

    // Get counts by variant
    const variantCounts = {};
    const creepsByRole = {};

    for (const name in Game.creeps) {
      const creep = Game.creeps[name];
      if (creep.room.name !== room.name) continue;

      const variant = creep.memory.variant;
      const role = creep.memory.role;

      if (variant) {
        variantCounts[variant] = (variantCounts[variant] || 0) + 1;
      }

      if (role) {
        if (!creepsByRole[role]) {
          creepsByRole[role] = [];
        }
        creepsByRole[role].push(creep);
      }
    }

    // Draw creep counts by role
    visual.rect(room.controller.pos.x - 5, room.controller.pos.y + 2, 10, 6, {
      fill: "rgba(0,0,0,0.5)",
      opacity: 0.5,
    });

    let y = room.controller.pos.y + 3;
    for (const role in creepsByRole) {
      visual.text(
        `${role}: ${creepsByRole[role].length}`,
        room.controller.pos.x,
        y,
        {
          align: "center",
          font: 0.6,
          color: this.getRoleColor(role),
        }
      );
      y += 1;
    }
  },

  renderEnergyFlow: function (room) {
    const sources = room.find(FIND_SOURCES);
    const spawn = room.find(FIND_MY_SPAWNS)[0];
    const controller = room.controller;

    // Draw energy flow lines between key points
    for (const source of sources) {
      // Find miners at this source
      const miners = _.filter(
        Game.creeps,
        (c) => c.memory.role === "miner" && c.memory.sourceId === source.id
      );

      if (miners.length > 0) {
        // Draw line from source to miners
        visual.line(source.pos, miners[0].pos, {
          color: "yellow",
          width: 0.15,
          opacity: 0.3,
        });

        // Find carriers that might be carrying from this source
        const carriers = _.filter(
          Game.creeps,
          (c) =>
            c.memory.role === "carry" &&
            c.memory.sourceId === source.id &&
            c.store[RESOURCE_ENERGY] > 0
        );

        for (const carrier of carriers) {
          visual.line(
            carrier.pos,
            carrier.memory.targetId
              ? Game.getObjectById(carrier.memory.targetId).pos
              : spawn.pos,
            {
              color: "green",
              width: 0.15,
              opacity: 0.3,
              lineStyle: "dashed",
            }
          );
        }
      }
    }

    // Show upgrader activity
    const upgraders = _.filter(
      Game.creeps,
      (c) => c.memory.role === "upgrade" && c.room.name === room.name
    );

    for (const upgrader of upgraders) {
      visual.line(upgrader.pos, controller.pos, {
        color: "blue",
        width: 0.15,
        opacity: 0.3,
      });
    }

    // Show builder activity
    const builders = _.filter(
      Game.creeps,
      (c) =>
        c.memory.role === "build" &&
        c.room.name === room.name &&
        c.memory.targetId
    );

    for (const builder of builders) {
      const target = Game.getObjectById(builder.memory.targetId);
      if (target) {
        visual.line(builder.pos, target.pos, {
          color: "purple",
          width: 0.15,
          opacity: 0.3,
        });
      }
    }

    // Show mover activity
    const movers = _.filter(
      Game.creeps,
      (c) =>
        c.memory.role === "mover" &&
        c.room.name === room.name &&
        c.memory.targetId
    );

    for (const mover of movers) {
      const target = Game.getObjectById(mover.memory.targetId);
      if (target) {
        visual.line(mover.pos, target.pos, {
          color: "orange",
          width: 0.2,
          opacity: 0.5,
        });
      }
    }
  },

  getRoleColor: function (role) {
    // Return a color for each role
    switch (role) {
      case "miner":
        return "rgba(255,255,0,0.8)"; // Yellow
      case "mover":
        return "rgba(255,165,0,0.8)"; // Orange
      case "carry":
        return "rgba(0,255,0,0.8)"; // Green
      case "upgrade":
        return "rgba(0,0,255,0.8)"; // Blue
      case "build":
        return "rgba(255,0,255,0.8)"; // Purple
      default:
        return "rgba(255,255,255,0.8)"; // White
    }
  },
};
