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

  // ****   Init Config   **** //
  //
  grunt.initConfig({
    screeps: {
      options: {
        email: "process.env.SCREEPS_EMAIL", // stored in git secrets
        token: "process.env.SCREEPS_TOKEN", // stored in git secrets
        branch: "default",
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
    // Copy and flatten
    copy: {
      flatten_all: {
        expand: true,
        cwd: 'src/',             // your nested source directory
        src: ['**/*.*'],         // match all files recursively
        dest: 'build/',          // output directory
        flatten: true            // removes path nesting
      }
    }    
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
