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

  // Define action result constants
  ACTION_RESULT: {
    FAILURE_REMOVE: -2, // Action failed and remove from queue
    FAILURE: -1, // Action failed
    CONTINUE: 0, // Continue current action
    CONTINUE_REMOVE: 1, // Continue processing and remove this action
    SUCCESS: 2, // Action succeeded
    SUCCESS_REMOVE: 3, // Action succeeded and remove this action
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
  processActionQueue: function (creep, actionQueue) {
    let result = 0;
    if (!actionQueue || actionQueue.length === 0) {
      return this.ACTION_RESULT.FAILURE_REMOVE;
    }

    for (
      let i = 0;
      result < this.ACTION_RESULT.SUCCESS &&
      i < creep.memory.actionQueue.length;
      i++
    ) {
      let currentActionData = creep.memory.actionQueue[i];

      // Handle nested action lists
      if (Array.isArray(currentActionData)) {
        result = this.processActionQueue(creep, currentActionData);
      } else {
        result = this.processActionNode(creep, currentActionData);
      }

      // Based on result, manage the queue
      if (
        result === this.ACTION_RESULT.CONTINUE_REMOVE ||
        result === this.ACTION_RESULT.SUCCESS_REMOVE ||
        result === this.ACTION_RESULT.FAILURE_REMOVE
      ) {
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
    return this.ACTION_RESULT.FAILURE_REMOVE;
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

    return this.ACTION_RESULT.CONTINUE_REMOVE;
  },

  // Move to Sit Position
  //
  actionMoveToSitPOS: function (creep) {
    if (!creep.memory.sitPOS) {
      console.log(`Creep ${creep.name} has no sitPOS set.`);
      return this.ACTION_RESULT.FAILURE;
    }

    var mPOS = creep.memory.sitPOS;
    var sitPOS = new RoomPosition(mPOS.x, mPOS.y, mPOS.roomName);

    if (creep.pos.isEqualTo(sitPOS)) {
      return this.ACTION_RESULT.CONTINUE_REMOVE;
    } else {
      const moveResult = utils.action.moveTo(creep, sitPOS);
      if (moveResult === OK) {
        return this.ACTION_RESULT.SUCCESS; //
      } else {
        // utils.action.logError(creep, moveResult, `moveToSitPOS, ${sitPOS}`);
      }
    }

    return this.ACTION_RESULT.FAILURE;
  },

  //  Mine
  //
  actionMine: function (creep) {
    if (!creep.memory.sourceId) {
      console.log(`Creep ${creep.name} has no source set.`);
      creep.memory.sourceId = creep.pos.findClosestByPath(FIND_SOURCES).id;
      // return this.ACTION_RESULT.FAILURE;
    }

    var source = Game.getObjectById(creep.memory.sourceId);

    var error = creep.harvest(source);

    if (error === OK) {
      return this.ACTION_RESULT.SUCCESS;
    } else if (error === ERR_NOT_ENOUGH_RESOURCES) {
      creep.memory.idleTicks++;
    } else if (error === ERR_NOT_IN_RANGE) {
      console.log(`Creep ${creep.name} is not in range to harvest.`);
    } else {
      util.action.logError(creep, error, `harvest, ${source.id}`);
    }
    return this.ACTION_RESULT.FAILURE;
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
