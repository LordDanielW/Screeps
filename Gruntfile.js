module.exports = function (grunt) {
  // ****   Load Tasks  **** //
  grunt.loadNpmTasks("grunt-screeps");
  grunt.loadNpmTasks("grunt-eslint");
  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-copy");

  grunt.registerTask("speak", function () {
    console.log("I'm Speaking");
  });
  grunt.registerTask("yell", function () {
    console.log("I'm YELLING");
  });
  grunt.registerTask("both", ["speak", "concat"]);
  grunt.registerTask("default", ["eslint", "concat", "screeps", "watch"]);
  grunt.registerTask("fast", ["concat", "screeps"]);

  // ****   Init Config   **** //
  grunt.initConfig({
    screeps: {
      options: {
        email: "process.env.SCREEPS_EMAIL",
        token: "process.env.SCREEPS_TOKEN",
        branch: "default",
        //server: 'season'
      },
      dist: {
        src: ["build/*.js"],
      },
    },
    eslint: {
      target: ["source/**/*.js"],
    },
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
