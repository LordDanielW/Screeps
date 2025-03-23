module.exports = {
  // Clean up dead creep memory
  cleanup: function () {
    for (const name in Memory.creeps) {
      if (!Game.creeps[name]) {
        delete Memory.creeps[name];
      }
    }
  },

  // Initialize memory structure
  initialize: function () {
    if (!Memory.speedRun) {
      Memory.speedRun = {
        startTick: Game.time,
        cyclePhase: 0,
        lastPhaseChange: Game.time,
        stats: {
          energyMined: 0,
          energyUsed: 0,
          idleTicks: {
            byCreep: {},
            spawn: 0,
          },
        },
        construction: {
          completed: {},
        },
      };
    }
  },

  // Serialize important game state for debugging
  serializeState: function (room) {
    const state = {
      tick: Game.time,
      runtime: Game.time - Memory.speedRun.startTick,
      rcl: room.controller.level,
      progress: {
        current: room.controller.progress,
        total: room.controller.progressTotal,
        percentage: Math.floor(
          (room.controller.progress / room.controller.progressTotal) * 100
        ),
      },
      energy: {
        available: room.energyAvailable,
        capacity: room.energyCapacityAvailable,
        mined: Memory.speedRun.stats.energyMined,
        used: Memory.speedRun.stats.energyUsed,
      },
      creeps: {
        count: Object.keys(Game.creeps).length,
        byRole: _.countBy(Game.creeps, (c) => c.memory.role),
        byVariant: _.countBy(Game.creeps, (c) => c.memory.variant),
        idle: Object.keys(Game.creeps).filter(
          (name) => Game.creeps[name].memory.idle
        ).length,
      },
      structures: {
        extensions: room.find(FIND_STRUCTURES, {
          filter: (s) => s.structureType === STRUCTURE_EXTENSION,
        }).length,
        containers: room.find(FIND_STRUCTURES, {
          filter: (s) => s.structureType === STRUCTURE_CONTAINER,
        }).length,
        constructionSites: room.find(FIND_CONSTRUCTION_SITES).length,
      },
      phase: {
        current: Memory.speedRun.cyclePhase,
        elapsed: Game.time - Memory.speedRun.lastPhaseChange,
      },
    };

    console.log(`Game state at tick ${state.tick}: ${JSON.stringify(state)}`);
    return state;
  },
};
