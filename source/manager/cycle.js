module.exports = {
  CYCLE_LENGTH: 1500,

  update: function () {
    const currentTick = Game.time;
    const cycleStart = Memory.speedRun.lastPhaseChange;
    const elapsed = currentTick - cycleStart;

    // Check if we need to move to the next phase
    if (elapsed >= this.CYCLE_LENGTH) {
      Memory.speedRun.cyclePhase = (Memory.speedRun.cyclePhase + 1) % 3; // 3 phases in total
      Memory.speedRun.lastPhaseChange = currentTick;

      // Adjust priorities based on new phase
      this.setPriorities();
    }
  },

  setPriorities: function () {
    // Different phases prioritize different activities
    switch (Memory.speedRun.cyclePhase) {
      case 0: // Energy collection focus
        Memory.speedRun.priorities = {
          spawn: 0.6,
          upgrade: 0.2,
          build: 0.2,
        };
        break;
      case 1: // Upgrading focus
        Memory.speedRun.priorities = {
          spawn: 0.3,
          upgrade: 0.6,
          build: 0.1,
        };
        break;
      case 2: // Building focus
        Memory.speedRun.priorities = {
          spawn: 0.3,
          upgrade: 0.3,
          build: 0.4,
        };
        break;
    }
  },

  getCurrentPhase: function () {
    return Memory.speedRun.cyclePhase;
  },

  getElapsedInPhase: function () {
    return Game.time - Memory.speedRun.lastPhaseChange;
  },
};
