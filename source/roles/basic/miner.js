var roleMiner = {
  //  Run Miner
  //
  run: function (creep) {
    // Initialize action queue if it doesn't exist
    if (!creep.memory.actionQueue) {
      this.initializeActionQueue(creep);
    }

    // Process the action queue
    return this.processActionQueue(creep, creep.memory.actionQueue);
  },

  // Map action names to their handler functions - defined once
  actionMap: null,

  // Initialize the action map if needed
  getActionMap: function () {
    if (!this.actionMap) {
      this.actionMap = {
        initializeMemory: this.actionInitMinerMemory,
        moveToSitPOS: this.actionMoveToSitPOS,
        mine: this.actionMine,
      };
    }
    return this.actionMap;
  },

  //  Initialize Action Queue
  //
  initializeActionQueue: function (creep) {
    creep.memory.actionQueue = [
      { action: "initializeMemory" },
      { action: "moveToSitPOS" },
      { action: "mine" },
    ];
  },

  //  Process Action Queue
  //
  //  -1 = Failure
  //   0 = Continue
  //   1 = Continue and Remove from Queue
  //   2 = Success
  //   3 = Success and Remove from Queue
  processActionQueue: function (creep, actionQueue) {
    let result = 0;
    if (!actionQueue || actionQueue.length === 0) {
      return -1; // No actions to process
    }

    for (let i = 0; result < 2 && i < creep.memory.actionQueue.length; i++) {
      let currentActionData = creep.memory.actionQueue[i];

      // Handle nested action lists
      if (Array.isArray(currentActionData)) {
        result = this.processActionQueue(creep, currentActionData);
      } else {
        result = this.processActionNode(creep, currentActionData);
      }

      // Based on result, manage the queue
      if (result === 1 || result === 3) {
        // Remove action from queue
        creep.memory.actionQueue.splice(i, 1);
        i--; // Adjust index after removal
      }
    }
    return result;
  },

  // Execute Action
  //
  processActionNode: function (creep, actionData) {
    const actionName = actionData.action;
    if (this.actionMap === null) {
      this.actionMap = this.getActionMap();
    }
    const actionMap = this.actionMap;

    if (actionMap[actionName]) {
      return actionMap[actionName].call(this, creep, actionData);
    }

    console.log(`Unknown action: ${actionName} for creep ${creep.name}`);
    return -1;
  },

  //  Initialize Miner Memory
  //
  actionInitMinerMemory: function (creep, actionData) {
    if (!creep.memory.sourceType) {
      creep.memory.sourceType = FIND_SOURCES;
    }

    if (creep.memory.sitPOS) {
      utils.action.findOptimalMiningPosition(creep);
    }

    return 0;
  },

  // Move to Sit Position
  //
  actionMoveToSitPOS: function (creep) {
    if (!creep.memory.sitPOS) {
      console.log(`Creep ${creep.name} has no sitPOS set.`);
      return -1; // No mining position set, failure
    }

    var mPOS = creep.memory.sitPOS;
    var sitPOS = new RoomPosition(mPOS.x, mPOS.y, mPOS.roomName);

    if (creep.pos.isEqualTo(sitPOS)) {
      // At position, find closest source
      var source = creep.pos.findClosestByRange(creep.room.find(FIND_SOURCES));

      if (source) {
        creep.memory.source = source.id;
        return 1; // Success, proceed to next action
      }
      return 0; // At position but no source found
    } else {
      // Move to position
      const moveResult = utils.action.moveTo(creep, sitPOS);
      return 0; // Continue moving next tick
    }
  },

  //  Mine
  //
  actionMine: function (creep) {
    if (!creep.memory.source) {
      console.log(`Creep ${creep.name} has no source set.`);
      return -1;
    }

    var source = Game.getObjectById(creep.memory.source);
    if (!source) {
      console.log(`Creep ${creep.name} has an invalid source.`);
      creep.memory.source = null;
      return -1;
    }

    var error = creep.harvest(source);

    if (error === OK) {
      return 1;
    } else if (error === ERR_NOT_ENOUGH_RESOURCES) {
      creep.memory.idleTicks++;
    } else if (error === ERR_NOT_IN_RANGE) {
      console.log(`Creep ${creep.name} is not in range to harvest.`);
    } else {
      util.action.logError(creep, error, `harvest, ${source.id}`);
    }
    return -1;
  },

  //  Sing
  //
  sing: function (creep, lyricSet = LYRICS.rammstein) {
    if (!creep.memory.sayIndex) {
      creep.memory.sayIndex = 0;
    }

    if (creep.memory.sayIndex >= lyricSet.lines.length) {
      creep.memory.sayIndex = lyricSet.loop ? lyricSet.loopIndex || 0 : 0;
    }

    creep.say(lyricSet.lines[creep.memory.sayIndex], true);
    creep.memory.sayIndex++;
  },
};

// Global lyrics object
global.LYRICS = {
  rammstein: {
    name: "Du Hast",
    lines: ["du!", "du hast!", "du hast -", "mich!", " 💥  💣 💥 "],
    loop: true,
    loopIndex: 0,
  },
  vitas: {
    name: "Chum Drum Bedrum",
    lines: [
      "Ya prishol",
      "daty etu",
      "piesnyu",
      "Ya prishol",
      "daty etu",
      "piesnyu",
      "Iz mira",
      "gryoz",
      "chum drum",
      "bedrum",
    ],
    loop: true,
    loopIndex: 0,
  },
};

module.exports.Miner = roleMiner;
