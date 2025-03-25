const roles = {
  miner: require("miner"),
  minerStart: require("minerStart"),
  // mover: require("mover"),
  // carry: require("carry"),
  // upgrade: require("upgrade"),
  // build: require("build"),
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
