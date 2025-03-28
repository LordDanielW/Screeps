/**
 * Dynamic spawn schedule for Screeps world play
 * Still uses phases and cycles but makes adaptive decisions
 */
module.exports = {
  phases: [
    {
      id: 1,
      name: "Early Game",
      startTick: 0,
      endTick: 1399,
      // Instead of fixed tick spawns, we'll define target counts
      // and conditions for each phase
      targets: {
        miners: {
          minCount: 2,
          maxCount: 4,
          priority: 10,
          variants: ["minerStart", "minerTiny", "minerMed"],
          conditions: {
            // Use smaller miners early, better ones when we have more energy
            energyCheck: (room) => {
              if (room.energyCapacityAvailable >= 550) return "minerMed";
              if (room.energyCapacityAvailable >= 300) return "minerTiny";
              return "minerStart";
            },
          },
        },
        carriers: {
          minCount: 2,
          maxCount: 8,
          priority: 9,
          variants: ["carryStart", "carrySmall", "carryMed", "carryBig"],
          conditions: {
            energyCheck: (room) => {
              if (room.energyCapacityAvailable >= 500) return "carryBig";
              if (room.energyCapacityAvailable >= 300) return "carryMed";
              if (room.energyCapacityAvailable >= 200) return "carrySmall";
              return "carryStart";
            },
          },
        },
        upgraders: {
          minCount: 1,
          maxCount: 6,
          priority: 5,
          variants: ["upgradeSmall", "upgradeMed", "upgradeBig"],
          conditions: {
            energyCheck: (room) => {
              if (room.energyCapacityAvailable >= 750) return "upgradeBig";
              if (room.energyCapacityAvailable >= 550) return "upgradeMed";
              return "upgradeSmall";
            },
            // Only spawn max upgraders when storage is above threshold
            storageCheck: (room) => {
              const storage = room.storage;
              if (!storage) return false;
              return storage.store[RESOURCE_ENERGY] > 10000;
            },
          },
        },
        builders: {
          minCount: 1,
          maxCount: 3,
          priority: 7,
          variants: ["buildSmall", "buildMed"],
          conditions: {
            // Only spawn builders if there are construction sites
            constructionCheck: (room) => {
              return room.find(FIND_CONSTRUCTION_SITES).length > 0;
            },
            energyCheck: (room) => {
              if (room.energyCapacityAvailable >= 300) return "buildMed";
              return "buildSmall";
            },
          },
        },
        movers: {
          minCount: 1,
          maxCount: 2,
          priority: 8,
          variants: ["moverSmall", "moverMed"],
          conditions: {
            energyCheck: (room) => {
              if (room.energyCapacityAvailable >= 300) return "moverMed";
              return "moverSmall";
            },
          },
        },
      },
    },
    {
      id: 2,
      name: "Mid Game",
      startTick: 1400,
      endTick: 2599,
      targets: {
        // Similar structure with adjusted values for mid-game
        miners: {
          /* mid-game values */
        },
        carriers: {
          /* mid-game values */
        },
        upgraders: {
          /* mid-game values */
        },
        builders: {
          /* mid-game values */
        },
        movers: {
          /* mid-game values */
        },
        claimers: {
          minCount: 0,
          maxCount: 5,
          priority: 3,
          variants: ["claimSmall"],
          conditions: {
            // Only spawn claimers when we have enough energy and need to claim
            needsReserving: (room) => {
              // Check memory for remote rooms that need reserving
              return (
                Memory.remoteRooms &&
                Object.values(Memory.remoteRooms).some((r) => r.needsReserving)
              );
            },
          },
        },
      },
    },
    // Phase 3 and beyond
  ],
  // Keep variants definition the same as your original
  variants: {
    minerStart: {
      role: "miner",
      body: { work: 2, carry: 1, move: 0 },
      energy: 250,
    },
    // All your other variants
  },
};
