# Console Commands Documentation

This document provides an overview of the custom console commands available in the Screeps game.

## Commands

| 🕹️  | Command              | Description                                                                | Output                                                                                          |
| --- | -------------------- | -------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| 🔄  | `reset()`            | Restarts the game by killing all creeps and resetting stats.               | Logs the process of killing creeps and resetting stats, then returns "OK".                      |
| 📝  | `printMem()`         | Prints out the global Memory object and all creeps' memory in JSON format. | Logs the global Memory object and each creep's memory, then returns "OK".                       |
| 🔍  | `printCycle()`       | Displays information about the current cycle status.                       | Logs cycle information including phase, elapsed ticks, and scheduled spawns, then returns "OK". |
| ⏩  | `skipToTick(number)` | Skips to a specific tick in the cycle (for testing purposes).              | Updates cycle timing to simulate passage of time, then returns "OK".                            |
| 🚩  | `pF(flagName)`       | Selects a flag by name and stores it in Memory.                            | Returns true if flag exists, false otherwise.                                                   |
| 👷  | `pC(creepName)`      | Selects a creep by name and stores it in Memory.                           | Returns true if creep exists, false otherwise.                                                  |
| 🚶  | `mC(moveString)`     | Sends movement commands to the currently selected creep.                   | Stores the movement string in Memory.                                                           |
| 🏭  | `sC(spawnType)`      | Spawns a creep of the specified type by adding it to the spawn queue.      | Returns true if spawn was queued, false otherwise.                                              |
