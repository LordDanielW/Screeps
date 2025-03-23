const roles = {
  miner: require("./roles/miner"),
  mover: require("./roles/mover"),
  carry: require("./roles/carry"),
  upgrade: require("./roles/upgrade"),
  build: require("./roles/build"),
};

module.exports = {
  run: function (creep) {
    // If the creep is still spawning, ignore it
    if (creep.spawning) return;

    // Get the creep's role
    const role = creep.memory.role;

    // Run the appropriate role module
    if (roles[role]) {
      roles[role].run(creep);
    } else {
      console.log(`Unknown role: ${role} for creep: ${creep.name}`);
    }
  },
};
