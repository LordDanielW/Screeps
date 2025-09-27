# ToDO

This is a Readme to think about how I want to re-architect this.

World
-> To do later, hardcode Room State for now, later this will generate Room State

Room
-> Spawn Que
-> Repair Que
-> Attack Que
-> Room State

Creep
-> Task Que
-> Run
-> Memory

Was thinking about going TS / adding more Grunt tools, pipeline will be:
-> Source -> Build -> Distribution

Pretty sure below was AI that I haven't finished reviewing

# My Screeps Framework

This is a library of techniques to play Screeps with testing and experimenting with different algorithms as my learning and management styles change.

Phase 1 was learning the Screeps API. Lots of things were hardcoded, and moving between rooms was a manual process.
Phase 2 I built on a Room ticker of 1500 ticks. Then I created a Global Memory object that contained all of the hardcoded values. This moved the hardcoded values to memory allowing dynamic allocation.
Phase 3 build out. This is a work in progress. I think I want to move to code generating the dynamic allocation

## 🎯 Project Overview

## 🏗️ Architecture

### Core Components

- **Main Loop** (`main.js`) - Central game loop coordinator
- **Memory Management** (`memory.all.js`) - Dynamic memory initialization and cleanup
- **Room Management** (`manage.all.js`) - Room-level operations and coordination
- **Role System** (`roles.all.js`) - Creep behavior definitions and task management
- **Utilities** (`utils.all.js`) - Helper functions and console commands

### Build System

The project uses Grunt for build automation:

- Concatenates source files into deployable modules
- Includes ESLint for code quality
- Supports live deployment to Screeps servers
- Watch mode for rapid development iteration

## 🚀 Key Features

### 1. Dynamic Spawn Queue Management

- **Phase-based spawning**: Adapts creep composition based on room energy capacity (4 phases: 300, 550, 800, 800+ energy)
- **Role balancing**: Automatically maintains optimal ratios of miners, carriers, upgraders, builders, and repair units
- **Emergency spawning**: Fallback system when rooms have no active creeps
- **Multi-room coordination**: Manages spawn queues across multiple rooms and spawners

### 2. Advanced Room Management

- **Energy flow optimization**: Tracks energy mining, storage, and consumption
- **Infrastructure management**: Handles towers, links, factories, and storage systems
- **Visual feedback**: Real-time room statistics and creep role distribution display
- **Safe mode activation**: Automatic defense when towers are low on energy

### 3. Intelligent Creep Roles

#### Basic Roles

- **Miner**: Stationary harvesters with action queue system
- **Carrier**: General purpose haulers with smart target selection
- **Upgrader**: Controller upgraders with efficiency optimizations
- **Builder**: Construction workers with task prioritization
- **Repair**: Maintenance units for structure upkeep

#### Specialized Roles

- **upCarrier**: Dedicated upgrade container supply chain
- **Linker**: Link energy transfer management
- **Trader**: Market operations and resource trading

#### Military Roles

- **Attacker**: Offensive units with targeting systems
- **Defender**: Room defense coordination
- **Breaker**: Structure demolition specialists
- **Healer**: Support units for military operations

### 4. Memory & Data Management

- **TaskMan system**: Centralized task and resource tracking
- **Container management**: Automatic detection and assignment of source/upgrade containers
- **Link coordination**: Automated link setup and energy transfer
- **Memory cleanup**: Garbage collection for dead creeps and invalid references

### 5. Utility Systems

- **Console commands**: Rich set of debugging and management tools
- **Visual displays**: Room statistics, spawn queues, and tower status
- **Error handling**: Comprehensive logging and error recovery
- **Resource tracking**: Energy flow analysis and optimization

## 📁 Project Structure

```
/source/
├── main.js                 # Main game loop and coordination
├── data/
│   └── taskMan.js         # Static data and room configurations
├── manage/
│   ├── factory.js         # Factory automation
│   ├── room.js            # Room-level management
│   ├── spawn.js           # Spawn queue management
│   ├── terminal.js        # Terminal operations
│   └── tower.js           # Tower coordination
├── memory/
│   ├── genMemory.js       # Memory initialization
│   ├── myGOB.js           # Game object database
│   └── spawnList.js       # Spawn configurations
├── roles/
│   ├── basic/             # Core creep roles
│   ├── market/            # Trading and economy roles
│   └── military/          # Combat and defense roles
└── utils/
    ├── consoleCommands.js # Debug and management commands
    ├── creepUtils.js      # Creep helper functions
    ├── displayUtils.js    # Visual feedback systems
    └── memoryUtils.js     # Memory management utilities
```

## 🔧 Configuration

### Room Setup

Rooms are automatically configured through the TaskMan system with:

- Source container detection and assignment
- Upgrade container identification
- Link network establishment
- Wall health thresholds
- Energy flow optimization

### Spawn Configuration

Each spawner maintains:

- Dynamic spawn queues based on room phase
- Role requirement calculations
- Body part optimization for energy efficiency
- Emergency spawn protocols

## 🎮 Console Commands

The system includes numerous console commands for debugging and management:

- `reset()` - Complete system restart
- `printMem()` - Memory dump and analysis
- `pC('creepName')` - Select and control individual creeps
- `pS('spawnName')` - Select spawners
- `sC('roleType')` - Manual creep spawning

## 🚧 Current Development Focus

### Planned Renovations

1. **TypeScript Migration**: Converting to TypeScript for better type safety and code organization
2. **Queue System Overhaul**: Streamlining creep job queues, spawn queues, and tower queues
3. **Code Consolidation**: Reducing complexity and improving maintainability
4. **Documentation Enhancement**: Creating detailed module-specific documentation

### Performance Optimizations

- CPU usage optimization
- Memory efficiency improvements
- Reduced redundant calculations
- Smarter pathfinding and movement

## 🏃‍♂️ Getting Started

1. **Install Dependencies**:

   ```bash
   npm install
   ```

2. **Configure Environment**:
   Create a `.env` file with your Screeps credentials:

   ```
   SCREEPS_EMAIL=your_email@example.com
   SCREEPS_TOKEN=your_token_here
   ```

3. **Build and Deploy**:

   ```bash
   grunt default  # Build, deploy, and watch for changes
   grunt fast     # Quick build and deploy
   ```

4. **Development**:
   ```bash
   grunt watch    # Auto-rebuild on file changes
   ```

## 📊 System Metrics

The framework tracks and optimizes:

- Energy mining efficiency per room
- Spawn utilization rates
- Tower energy levels and usage
- Creep population balance
- Construction and repair progress
- Market operations and resource flow
