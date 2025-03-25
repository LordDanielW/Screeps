# Console Commands Documentation

This document provides an overview of the custom console commands available in the Screeps game.

## Commands

| 🕹️  | Command             | Description                                                                | Output                                                                             |
| --- | ------------------- | -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| 🔄  | `restart()`         | Restarts the game by killing all creeps and resetting stats.               | Logs the process of killing creeps and resetting stats, then returns "OK".         |
| 📝  | `printMemory()`     | Prints out the global Memory object and all creeps' memory in JSON format. | Logs the global Memory object and each creep's memory, then returns "OK".          |
| 🌐  | `registerGlobals()` | Registers the console commands globally for easy access from the console.  | Logs a message indicating that the console commands have been registered globally. |
