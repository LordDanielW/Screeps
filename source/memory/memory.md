# Screeps Speed Run Memory Architecture

This document outlines the memory structure for the Screeps speed run to RCL 5.

## Overview

The memory is organized into separate namespaces to manage different aspects of the game:

- `Memory.main` - Global game state
- `Memory.cycle` - Cycle management (1500-tick cycle)
- `Memory.creeps` - Individual creep memory (auto-generated per creep)
- `Memory.vis` - Visualization data
- `Memory.spawn` - Spawn queue and management

## TypeScript Interfaces

```typescript
// Main memory interface
interface MainMemory {
  startTick: number; // When the speed run started
  elapsedTicks: number; // Current run duration
  targetTicks: number; // Goal (9000)
  paused: boolean; // If simulation is paused
  debug: boolean; // Debug mode flag
  lastUpdateTime: number; // Timestamp of last update
}

// Cycle management
interface CycleMemory {
  currentPhase: number; // Current phase (0-2)
  phaseStartTick: number; // When current phase started
  phaseLength: number; // Length of phase (default 1500)
  nextCreepVariant: string; // Next creep to spawn
}

// Creep memory
interface CreepMemory {
  role: string; // miner, mover, carry, upgrade, build
  variant: string; // minerTiny, minerSmall, mostly size etc.
  idle: boolean; // Is creep idle?
  positioned: boolean; // Is creep in position? (for stationary creeps)
  sourceId?: string; // ID of assigned energy source
  targetId?: string; // ID of current target
  task?: string; // Current task (harvest, deliver, build, etc.)
  destinationId?: string; // ID of destination (for movers)
  path?: {
    // Path data
    waypoints: RoomPosition[];
    nextWaypoint: number;
  };
  stats: {
    // Creep performance stats
    idleTicks: number;
  };
}

// Visualization data
interface VisMemory {
  overlayEnabled: boolean; // If visualization is enabled
  layers: {
    // Visualization layers
    stats: boolean; // Show stats overlay
    creeps: boolean; // Show creep info
    energyFlow: boolean; // Show energy flow
    construction: boolean; // Show construction sites
    paths: boolean; // Show paths
  };
  colors: {
    // Color settings
    miner: string;
    mover: string;
    carry: string;
    upgrade: string;
    build: string;
  };
  lastCapture?: number; // For performance tracking
}

// Spawn management
interface SpawnMemory {
  queue: {
    // Spawn queue
    variant: string; // Creep variant to spawn
    priority: number; // Spawn priority (higher = more important)
    memory: Partial<CreepMemory>; // Custom memory to assign
  }[];
  stats: {
    // Spawn statistics
    totalSpawned: number; // Total creeps spawned
    spawnsByVariant: Record<string, number>; // Count by variant
    idleTicks: number; // How long spawn was idle
  };
}

// Global memory declaration - this should be included in a global.d.ts file
declare namespace NodeJS {
  interface Global {
    Memory: {
      main: MainMemory;
      cycle: CycleMemory;
      creeps: { [name: string]: CreepMemory };
      vis: VisMemory;
      spawn: SpawnMemory;
      stats: Record<string, any>;
    };
  }
}
```

## Memory Initialization

The memory structure should be initialized when the script first runs:

```typescript
function initializeMemory() {
  // Initialize Main Memory
  if (!Memory.main) {
    Memory.main = {
      startTick: Game.time,
      elapsedTicks: 0,
      targetTicks: 9000,
      paused: false,
      debug: true,
      lastUpdateTime: Date.now(),
    };
  }

  // Initialize Cycle Memory
  if (!Memory.cycle) {
    Memory.cycle = {
      currentPhase: 0,
      phaseStartTick: Game.time,
      phaseLength: 1500,
      priorities: {
        upgrade: 0.4,
        build: 0.3,
        spawn: 0.2,
        repair: 0.1,
      },
      nextCreepVariant: "",
    };
  }

  // Initialize Visualization Memory
  if (!Memory.vis) {
    Memory.vis = {
      overlayEnabled: true,
      layers: {
        stats: true,
        creeps: true,
        energyFlow: true,
        construction: true,
        paths: true,
      },
      colors: {
        miner: "#ffff00",
        mover: "#ff9900",
        carry: "#00ff00",
        upgrade: "#0000ff",
        build: "#ff00ff",
      },
    };
  }

  // Initialize Spawn Memory
  if (!Memory.spawn) {
    Memory.spawn = {
      queue: [],
      stats: {
        totalSpawned: 0,
        spawnsByVariant: {},
        idleTicks: 0,
      },
    };
  }
}
```

## Memory Access Examples

Here are some examples of how to access and update the memory:

```typescript
// Update elapsed ticks in main memory
Memory.main.elapsedTicks = Game.time - Memory.main.startTick;

// Change cycle phase
Memory.cycle.currentPhase = (Memory.cycle.currentPhase + 1) % 3;
Memory.cycle.phaseStartTick = Game.time;

// Add to spawn queue
Memory.spawn.queue.push({
  variant: "minerMedium",
  priority: 10,
  memory: {
    role: "miner",
    sourceId: "e3f7cc371a8b8c3",
  },
});

// Sort spawn queue by priority
Memory.spawn.queue.sort((a, b) => b.priority - a.priority);

// Record creep stats
if (creep.memory.stats) {
  creep.memory.stats.energyHarvested += 2 * creep.getActiveBodyparts(WORK);
}

// Enable/disable visualization layer
Memory.vis.layers.energyFlow = false;
```

## Memory Cleanup

To prevent memory leaks, perform cleanup routines:

```typescript
function cleanupMemory() {
  // Clean up dead creeps
  for (const name in Memory.creeps) {
    if (!Game.creeps[name]) {
      delete Memory.creeps[name];
    }
  }

  // Limit queue size
  if (Memory.spawn.queue.length > 10) {
    Memory.spawn.queue = Memory.spawn.queue.slice(0, 10);
  }
}
```
