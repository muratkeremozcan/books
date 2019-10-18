module.exports = function(grunt) {
  grunt.initConfig({ // GRUNT.INITCONFIG configuration for each grunt task
    less: { // config for COMPILING LESS WITH GRUNT
      main: {
        options: {
          paths: ["my_css"] // use this source folder
        },
        files: {
          "tmp/serve/main.css": "my_css/main.less"  // target: source
        }
      }
    },
    browserify: { // config for USING BROWSERIFY WITH GRUNT
      client: {
        src: ["my_javascripts/main.js"], // compiles main.js into tmp/serve/main.js
        dest: "tmp/serve/main.js"
      }
    },
    uglify: { // config for using UGLIFY WITH GRUNT
      myClient: {
        files: {
          "tmp/serve/main.min.js": ["tmp/serve/main.js"]
        }
      }
    },
    watch: {
      scripts: {
        files: ["**/*.js"], // when these files change...
        tasks: ["browserify"] // run this task on them
      },
      styles: {
        files: ["**/*.less"], // when these files change...
        tasks: ["less"] // run this task on them
      }
    }
  });

  // GRUNT.LOADNPMTASKS: load grunt plugins
  grunt.loadNpmTasks("grunt-contrib-less"); // grunt less plugin
  grunt.loadNpmTasks("grunt-browserify"); // grunt browserify plugin
  grunt.loadNpmTasks("grunt-contrib-uglify"); // uglify reduces file sizes
  grunt.loadNpmTasks("grunt-contrib-watch"); // grunt task that watches you files an reruns any grunt tasks when change occurs

  grunt.registerTask("default", ["browserify", "less", "uglify"]); // you can run  npm run grunt, and it runs these default tasks
  // you can also run tasks a-la-carte :  npm run grunt taskName:browserify/less/uglify
};

/*
http://gruntjs.com/plugins
■
grunt-contrib-sass is the Sass version of the LESS plugin you used. If you’d
rather use Sass or SCSS , give this a look.
■
grunt-contrib-requirejs uses the Require.js module system instead of Brow-
serify. If that sounds better to you, you can use it instead.
■
grunt-contrib-concat concatenates files, which is a low-tech but popular solu-
tion for lots of problems.
■
grunt-contrib-imagemin minifies images (like JPEG s and PNG s). If you want to
save bandwidth, this is a good tool.
■
grunt-contrib-coffee lets you write CoffeeScript instead of JavaScript for
your client-side code
*/