const gulp = require('gulp'); // gulp plugins are loaded like standard Node modules
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const watch = require('gulp-watch');

gulp.task('default', () => {
  return gulp.src('app/*.jsx') // 1 GATHER INPUT FILES: the built-in gulp.src (search) file globbing utility is used to find all React.jsx files
    .pipe(sourcemaps.init()) // 2 TRANSPILE: sourcemaps stage 1: start watching source files to build sourcemaps for debugging
    .pipe(babel({ // configure gulp-babel to use ES2015 and React(JSX) PLUGINs
      presets: ['es2015', 'react'] // out of the box Babel doesn't do anything; You will need to add plugins for Babel to do something. You can also enable a set of plugins in a preset
    }))
    .pipe(concat('all.js')) // 3 CONCAT: pipe files together to create a build
    .pipe(sourcemaps.write('.')) // 4 OUTPUT: sourcemaps stage 2: write the source map files separately. This line creates all.js.map file
    .pipe(gulp.dest('dist')); // redirects all files to dist/ folder
});
gulp.task('watch', () => { // this watch task watches the file app/index.jsx, calls the above task if there are any changes in the file
  watch('app/**.jsx', () => gulp.start('default'));
});

/**GULP
 * gulp is a JS API for automating builds
 * Gulp helps you achieve a high level of reuse through two techniques
 * using PLUGINs
 * automating build tasks
 */
// type 'gulp; in terminal to execute. Reads index.js, transpiles with plugins: es2015 and React, pipes to dist/all.js