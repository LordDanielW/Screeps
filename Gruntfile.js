require("dotenv").config();

module.exports = function (grunt) {
  // Load tasks
  grunt.loadNpmTasks("grunt-screeps");
  grunt.loadNpmTasks("grunt-eslint");
  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-shell");

  // Your helper tasks
  grunt.registerTask("foo", () => console.log("Hello "));
  grunt.registerTask("bar", () => console.log("World!"));
  grunt.registerTask("both", ["foo", "bar"]);

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

  // Config
  grunt.initConfig({
    screeps: {
      options: {
        email: process.env.SCREEPS_EMAIL,
        token: process.env.SCREEPS_TOKEN,
        branch: "default",
      },
      dist: { src: ["build/*.js"] },
      world: {
        options: { branch: "world" },
        src: ["build/*.js"],
      },
    },

    // ESLINT
    eslint: {
      options: {
        // Set to true so lint never blocks deployment
        force: true,
        // If you want to fail on errors locally: force: false
      },
      target: ["source/**/*.js"],
    },

    // CONCAT
    concat: {
      manage: {
        src: ["source/manage/*.js"],
        dest: "build/manage.all.js",
        options: {
          banner:
            "var utils = require('utils.all');" +
            "var myMemory = require('memory.all');" +
            "if (!module.exports) module.exports = {};",
        },
      },
      memory: { src: ["source/memory/*.js"], dest: "build/memory.all.js" },
      roles: {
        src: ["source/roles/**/*.js"],
        dest: "build/roles.all.js",
        options: {
          banner:
            "var utils = require('utils.all');" +
            "if (!module.exports) module.exports = {};",
        },
      },
      utils: { src: ["source/utils/*.js"], dest: "build/utils.all.js" },
      main: { src: ["source/main.js"], dest: "build/main.js" },
    },

    // SYNTAX + (optional) TYPECHECK + TEST
    shell: {
      syntax: {
        // Windows
        command: 'for %f in (build\\*.js) do node --check "%f"',
        options: { execOptions: { shell: true } },
      },
      // macOS/Linux variant (uncomment and comment out the Windows one above)
      // syntax: { command: 'for f in build/*.js; do node --check "$f"; done' },

      // Optional stronger checks:
      // typecheck: { command: "npx tsc --noEmit" },
      // test: { command: "npx jest --runInBand" }
    },

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
      main: { files: ["source/main.js"], tasks: ["concat:main", "screeps"] },
    },
  });

  // Pipelines
  // Default: lint (non-blocking) → build → syntax check → deploy → watch
  grunt.registerTask("default", [
    "eslint",
    "concat",
    "shell:syntax",
    "screeps",
    "watch",
  ]);

  // Fast: build → syntax → deploy
  grunt.registerTask("fast", ["concat", "shell:syntax", "screeps:dist"]);

  // World branch
  grunt.registerTask("world", ["concat", "shell:syntax", "screeps:world"]);

  // Strict (run locally if you want failures to stop you):
  // grunt.registerTask("strict", ["eslint", "concat", "shell:syntax", "shell:typecheck", "shell:test", "screeps"]);
};
