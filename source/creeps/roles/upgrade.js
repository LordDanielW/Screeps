module.exports = {
    run: function(creep) {
        // Upgraders focus on controller upgrading
        // They need to be positioned near the controller and fed energy
        
        // First, check if we need to be positioned
        if (!creep.memory.positioned) {
            // We need to find a spot near the controller
            const controller = creep.room.controller;
            
            // If we're close enough, mark as positioned
            if (creep.pos.inRangeTo(controller, 3)) {
                creep.memory.positioned = true;
                return;
            }
            
            // If we have no MOVE parts, we can't position ourselves
            if (creep.getActiveBodyparts(MOVE) === 0) {
                creep.memory.idle = true;
                return;
            } else {
                // Move ourselves if we can
                creep.moveTo(controller, {visualizePathStyle: {stroke: '#0000ff'}});
                return;
            }
        }
        
        // If we have energy, upgrade
        if (creep.store[RESOURCE_ENERGY] > 0) {
            creep.memory.idle = false;
            creep.upgradeController(creep.room.controller);
        } else {
            // No energy, waiting for a carrier
            creep.memory.idle = true;
        }
    }
};