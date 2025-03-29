require("dotenv").config();

module.exports = function (grunt) {
  // ****   Load Tasks  **** //
  grunt.loadNpmTasks("grunt-screeps");
  grunt.loadNpmTasks("grunt-eslint");
  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-copy");

  //  How to Grunt
  //    terminal: grunt both
  grunt.registerTask("foo", function () {
    console.log("Hello ");
  });
  grunt.registerTask("bar", function () {
    console.log("World!");
  });
  grunt.registerTask("both", ["foo", "bar"]);

  // Grunt commands:
  //    default, fast, screeps
  grunt.registerTask("default", ["eslint", "concat", "screeps", "watch"]);
  grunt.registerTask("fast", ["concat", "screeps"]);

  grunt.registerTask("checkSecrets", function () {
    const email = process.env.SCREEPS_EMAIL;
    const token = process.env.SCREEPS_TOKEN;

    if (!email || !token) {
      grunt.log.error("❌ Missing SCREEPS_EMAIL or SCREEPS_TOKEN");
      return false;
    } else {
      grunt.log.writeln("✅ Screeps secrets are defined. Lengths:");
      grunt.log.writeln("Email length:", email.length);
      grunt.log.writeln("Token length:", token.length);
    }
  });

  // ****   Init Config   **** //
  //
  grunt.initConfig({
    screeps: {
      options: {
        email: process.env.SCREEPS_EMAIL, // stored in git secrets
        token: process.env.SCREEPS_TOKEN, // stored in git secrets
        branch: "world",
        //server: 'season'
      },
      dist: {
        src: ["build/*.js"],
      },
    },
    // ESLINT
    eslint: {
      target: ["source/**/*.js"],
    },
    // CONCAT
    concat: {
      manage: {
        src: ["source/manage/*.js"],
        dest: "build/manage.all.js",
      },
      memory: {
        src: ["source/memory/*.js"],
        dest: "build/memory.all.js",
      },
      roles: {
        src: ["source/roles/**/*.js"],
        dest: "build/roles.all.js",
        options: {
          banner:
            "var utils = require('utils.all');" +
            "if (!module.exports) module.exports = {};",
        },
      },
      utils: {
        src: ["source/utils/*.js"],
        dest: "build/utils.all.js",
      },
      main: {
        src: ["source/main.js"],
        dest: "build/main.js",
      },
    },
    // WATCH
    watch: {
      manage: {
        files: ["source/manage/*.js"],
        tasks: ["concat:manage", "screeps"],
      },
      memory: {
        files: ["source/memory/*.js"],
        tasks: ["concat:memory", "screeps"],
      },
      roles: {
        files: ["source/roles/**/*.js"],
        tasks: ["concat:roles", "screeps"],
      },
      utils: {
        files: ["source/utils/*.js"],
        tasks: ["concat:utils", "screeps"],
      },
      main: {
        files: ["source/main.js"],
        tasks: ["concat:main", "screeps"],
      },
    },
  });
};
