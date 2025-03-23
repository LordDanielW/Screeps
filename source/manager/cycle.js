module.exports = {
  CYCLE_LENGTH: 1500,

  // Creep configurations by name variants
  creepVariants: {
    miner: {
      minerStart: {
        body: { work: 2, carry: 1, move: 0 },
        memory: { role: "miner", variant: "minerTiny", idle: false },
        minEnergy: 250,
        RCL: 1,
      },
      minerTiny: {
        body: { work: 2, carry: 1, move: 0 },
        memory: { role: "miner", variant: "minerTiny", idle: false },
        minEnergy: 250,
        RCL: 1,
      },
      minerSmall: {
        body: { work: 4, carry: 1, move: 0 },
        memory: { role: "miner", variant: "minerSmall", idle: false },
        minEnergy: 450,
        RCL: 2,
      },
      minerMedium: {
        body: { work: 5, carry: 1, move: 0 },
        memory: { role: "miner", variant: "minerMedium", idle: false },
        minEnergy: 550,
        RCL: 3,
      },
      minerLarge: {
        body: { work: 6, carry: 1, move: 0 },
        memory: { role: "miner", variant: "minerLarge", idle: false },
        minEnergy: 650,
        RCL: 5,
      },
    },
    mover: {
      moverTiny: {
        body: { move: 2 },
        memory: {
          role: "mover",
          variant: "moverTiny",
          idle: true,
          hasTask: false,
        },
        minEnergy: 100,
        RCL: 1,
      },
      moverSmall: {
        body: { move: 4 },
        memory: {
          role: "mover",
          variant: "moverSmall",
          idle: true,
          hasTask: false,
        },
        minEnergy: 200,
        RCL: 2,
      },
      moverMedium: {
        body: { move: 6 },
        memory: {
          role: "mover",
          variant: "moverMedium",
          idle: true,
          hasTask: false,
        },
        minEnergy: 300,
        RCL: 3,
      },
      moverLarge: {
        body: { move: 8 },
        memory: {
          role: "mover",
          variant: "moverLarge",
          idle: true,
          hasTask: false,
        },
        minEnergy: 400,
        RCL: 4,
      },
      moverHuge: {
        body: { move: 10 },
        memory: {
          role: "mover",
          variant: "moverHuge",
          idle: true,
          hasTask: false,
        },
        minEnergy: 500,
        RCL: 5,
      },
    },
    carry: {
      carryTiny: {
        body: { carry: 2, move: 2 },
        memory: {
          role: "carry",
          variant: "carryTiny",
          idle: true,
          hasTask: false,
        },
        minEnergy: 200,
        RCL: 1,
      },
      carrySmall: {
        body: { carry: 4, move: 2 },
        memory: {
          role: "carry",
          variant: "carrySmall",
          idle: true,
          hasTask: false,
        },
        minEnergy: 300,
        RCL: 2,
      },
      carryMedium: {
        body: { carry: 6, move: 3 },
        memory: {
          role: "carry",
          variant: "carryMedium",
          idle: true,
          hasTask: false,
        },
        minEnergy: 450,
        RCL: 3,
      },
      carryLarge: {
        body: { carry: 8, move: 4 },
        memory: {
          role: "carry",
          variant: "carryLarge",
          idle: true,
          hasTask: false,
        },
        minEnergy: 600,
        RCL: 4,
      },
      carryHuge: {
        body: { carry: 10, move: 5 },
        memory: {
          role: "carry",
          variant: "carryHuge",
          idle: true,
          hasTask: false,
        },
        minEnergy: 750,
        RCL: 5,
      },
    },
    upgrade: {
      upgradeTiny: {
        body: { work: 1, carry: 1, move: 1 },
        memory: { role: "upgrade", variant: "upgradeTiny", idle: false },
        minEnergy: 200,
        RCL: 1,
      },
      upgradeSmall: {
        body: { work: 3, carry: 2, move: 0 },
        memory: { role: "upgrade", variant: "upgradeSmall", idle: false },
        minEnergy: 400,
        RCL: 2,
      },
      upgradeMedium: {
        body: { work: 5, carry: 2, move: 0 },
        memory: { role: "upgrade", variant: "upgradeMedium", idle: false },
        minEnergy: 600,
        RCL: 3,
      },
      upgradeLarge: {
        body: { work: 7, carry: 3, move: 0 },
        memory: { role: "upgrade", variant: "upgradeLarge", idle: false },
        minEnergy: 850,
        RCL: 4,
      },
      upgradeHuge: {
        body: { work: 9, carry: 3, move: 0 },
        memory: { role: "upgrade", variant: "upgradeHuge", idle: false },
        minEnergy: 1050,
        RCL: 5,
      },
    },
    build: {
      buildTiny: {
        body: { work: 1, carry: 1, move: 1 },
        memory: { role: "build", variant: "buildTiny", idle: false },
        minEnergy: 200,
        RCL: 1,
      },
      buildSmall: {
        body: { work: 2, carry: 2, move: 2 },
        memory: { role: "build", variant: "buildSmall", idle: false },
        minEnergy: 400,
        RCL: 2,
      },
      buildMedium: {
        body: { work: 3, carry: 3, move: 3 },
        memory: { role: "build", variant: "buildMedium", idle: false },
        minEnergy: 600,
        RCL: 3,
      },
      buildLarge: {
        body: { work: 4, carry: 4, move: 4 },
        memory: { role: "build", variant: "buildLarge", idle: false },
        minEnergy: 800,
        RCL: 4,
      },
      buildHuge: {
        body: { work: 5, carry: 5, move: 5 },
        memory: { role: "build", variant: "buildHuge", idle: false },
        minEnergy: 1000,
        RCL: 5,
      },
    },
  },

  // Target creep counts by RCL and cycle phase
  targetCounts: {
    phase0: {
      // Energy collection focus
      1: {
        minerTiny: 2,
        moverTiny: 1,
        carryTiny: 2,
        upgradeTiny: 1,
        buildTiny: 1,
      },
      2: {
        minerSmall: 2,
        moverSmall: 1,
        carrySmall: 3,
        upgradeSmall: 1,
        buildSmall: 1,
      },
      3: {
        minerMedium: 2,
        moverMedium: 2,
        carryMedium: 4,
        upgradeMedium: 2,
        buildMedium: 1,
      },
      4: {
        minerLarge: 2,
        moverLarge: 2,
        carryLarge: 5,
        upgradeLarge: 2,
        buildLarge: 2,
      },
      5: {
        minerLarge: 2,
        moverHuge: 2,
        carryHuge: 6,
        upgradeHuge: 3,
        buildHuge: 2,
      },
    },
    phase1: {
      // Upgrading focus
      1: {
        minerTiny: 2,
        moverTiny: 1,
        carryTiny: 2,
        upgradeTiny: 2,
        buildTiny: 0,
      },
      2: {
        minerSmall: 2,
        moverSmall: 1,
        carrySmall: 3,
        upgradeSmall: 2,
        buildSmall: 0,
      },
      3: {
        minerMedium: 2,
        moverMedium: 2,
        carryMedium: 4,
        upgradeMedium: 3,
        buildMedium: 0,
      },
      4: {
        minerLarge: 2,
        moverLarge: 2,
        carryLarge: 5,
        upgradeLarge: 3,
        buildLarge: 1,
      },
      5: {
        minerLarge: 2,
        moverHuge: 2,
        carryHuge: 6,
        upgradeHuge: 4,
        buildHuge: 1,
      },
    },
    phase2: {
      // Building focus
      1: {
        minerTiny: 2,
        moverTiny: 1,
        carryTiny: 2,
        upgradeTiny: 1,
        buildTiny: 2,
      },
      2: {
        minerSmall: 2,
        moverSmall: 1,
        carrySmall: 3,
        upgradeSmall: 1,
        buildSmall: 2,
      },
      3: {
        minerMedium: 2,
        moverMedium: 2,
        carryMedium: 4,
        upgradeMedium: 1,
        buildMedium: 2,
      },
      4: {
        minerLarge: 2,
        moverLarge: 2,
        carryLarge: 5,
        upgradeLarge: 1,
        buildLarge: 3,
      },
      5: {
        minerLarge: 2,
        moverHuge: 2,
        carryHuge: 6,
        upgradeHuge: 2,
        buildHuge: 3,
      },
    },
  },

  update: function () {
    const currentTick = Game.time;
    const cycleStart = Memory.speedRun.lastPhaseChange;
    const elapsed = currentTick - cycleStart;

    // Check if we need to move to the next phase
    if (elapsed >= this.CYCLE_LENGTH) {
      Memory.speedRun.cyclePhase = (Memory.speedRun.cyclePhase + 1) % 3; // 3 phases in total
      Memory.speedRun.lastPhaseChange = currentTick;
    }
  },

  // Determine what creep to spawn next
  getNextCreepToSpawn: function (room) {
    const rcl = room.controller.level;
    const phase = Memory.speedRun.cyclePhase;
    const phaseKey = "phase" + phase;

    // Get target counts for current RCL and phase
    const targetCounts = this.targetCounts[phaseKey][rcl];

    // Count existing creeps by variant
    const creepCounts = {};
    for (const name in Game.creeps) {
      const creep = Game.creeps[name];
      const variant = creep.memory.variant;
      if (variant) {
        creepCounts[variant] = (creepCounts[variant] || 0) + 1;
      }
    }

    // Find the variant with the lowest percentage of its target
    let lowestPercentage = 1;
    let variantToSpawn = null;

    for (const variant in targetCounts) {
      const current = creepCounts[variant] || 0;
      const target = targetCounts[variant];

      // Skip if target is 0
      if (target === 0) continue;

      const percentage = current / target;

      if (percentage < lowestPercentage) {
        lowestPercentage = percentage;
        variantToSpawn = variant;
      }
    }

    return variantToSpawn;
  },

  // Get the creep configuration for a specific variant
  getCreepConfig: function (variant) {
    // Search through all role variants to find the one with matching name
    for (const role in this.creepVariants) {
      if (this.creepVariants[role][variant]) {
        return {
          role: role,
          config: this.creepVariants[role][variant],
        };
      }
    }
    return null;
  },

  getCurrentPhase: function () {
    return Memory.speedRun.cyclePhase;
  },

  getElapsedInPhase: function () {
    return Game.time - Memory.speedRun.lastPhaseChange;
  },
};
