// ************************************

// JEKYLL
// - Create the HTML files only
// - Rebuild the site on any change (HTML or markdown)
// - Keep the ASSET folder alive (IMG, JS, CSS can still be generated from src)
// src: _data, _includes, _layout, _pages, posts
// dest: _site

// CSS
// - Copy vendor
// - Build CSS from SASS
// - Regenerate CSS at any file change
// - Auto-prefix CSS for compatibility
// - Minify CSS for distribution
// src: _src/scss, _src/css
// dest: -site/assets/css

// Javascript
// - Copy vendor
// - Uglify / Minify JS for distribution
// src: _src/js
// dest: _site/assets/js

// IMAGES
// - Resize the images to the correct sizes
// - Place them in correct folders
// - Optimize the size (Moz)
// src: src/img
// dest: _site/assets/img

// TASKS

// default:
//     - build-jekyll
//     - build-css
//     - build-js
//     - watch-change

// build-jekyll
//     - incremental build (build only changed files)

// build-css
//     - sass
//     - autoprefixer

// build-image:
//     - resize JPG images
//     - compress all images
//     - copy them to dest folder

// ************************************ DECLARATIONS ************************************

// ************************************
// #REQUIRED PACKAGES
// ************************************
const gulp = require('gulp');
var changed = require('gulp-changed');
const browserSync = require('browser-sync').create();

// SASS and CSS
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');

// Javascript
const minify = require('gulp-minify');

// Image processing
const imageResize = require('gulp-image-resize');

// For Jekyll
const child = require('child_process');
const gutil = require('gulp-util');

// For Clean
const del = require('del');

// ************************************
// #CONSTANTS
// ************************************
const siteRoot = '_site';
const jekyllFiles = [
  './_data/**',
  './_includes/**',
  './_layouts/**',
  './_pages/**',
  'posts/**'
];

// Set the browser that you want to support
var browserSupport = [
  'ie 10',
  'ie_mob 10',
  'ff 30',
  'chrome 34',
  'safari 7',
  'opera 23',
  'ios 7',
  'android 4.4',
  'bb 10'
];

// ************************************ MAIN TASKS ************************************

// ************************************
// #JEKYLL
// ************************************
// Build the html files
gulp.task('build-jekyll', () => {
  const jekyll = child.spawn('jekyll', [
    'build',
    // '--watch',
    '--incremental', // Rebuild only the pages which have changed
    '--drafts'
  ]);
  const jekyllLogger = buffer => {
    buffer
      .toString()
      .split(/\n/)
      .forEach(message => gutil.log('Jekyll: ' + message));
  };
  jekyll.stdout.on('data', jekyllLogger);
  jekyll.stderr.on('data', jekyllLogger);
});

// ************************************
// #CSS
// ************************************
// SASS:      Compile Sass to CSS
// COPY-CSS:  Copy css files to asset folder
// BUILD-CSS: Perform all the tasks

// Preprocess Sass files to a compiled CSS
gulp.task('sass', function() {
  return (
    gulp
      .src('./_src/scss/*.*')
      // Compile SASS files
      .pipe(sass().on('error', sass.logError))

      // Auto-prefix css styles for cross browser compatibility
      .pipe(
        autoprefixer({
          browsers: ['last 10 versions'], //, 'safari 5', 'ie 11', 'opera 12.1', 'ios 6', 'android 4'],
          cascade: false
        })
      )
      // Output
      .pipe(gulp.dest('./_site/assets/css'))
  );
});

// Copy the css files
gulp.task('copy-css', function() {
  gulp.src('./_src/css/**').pipe(gulp.dest('./_site/assets/css'));
});

// Subtask calling all css tasks
gulp.task('build-css', ['sass', 'copy-css']);

// ************************************
// #JAVASCRIPT
// ************************************
// JS:        Compile JS to asset folder
// BUILD-JS:  Perform all the tasks

// Copy the vendor files
gulp.task('copy-js', function() {
  gulp.src('./_src/js/**/*').pipe(gulp.dest('./_site/assets/js'));
});

// Subtask calling all javascript tasks
gulp.task('build-js', ['copy-js']);

// ************************************
// #BUILD TASK
// ************************************
gulp.task('build', ['build-jekyll', 'build-css', 'build-js']);

// ************************************ SIDE TASKS ************************************

// ************************************
// #CLEAN TASK
// ************************************
// CLEAN-HTML:  Delete all compiled html files
// CLEAN-CSS:   Delete all compiled css files
// CLEAN:       Perform all the tasks

gulp.task('clean-html', function() {
  return del('_site/**/*.html', { force: true });
});

gulp.task('clean-css', function() {
  return del('_site/**/*.css', { force: true });
});

gulp.task('clean', ['clean-html', 'clean-css']);

// ************************************
// #RESIZE IMAGE
// ************************************
var resizeImageTasks = [];
[400, 800, 1024, 1680, 1920].forEach(function(size) {
  var resizeImageTask = 'resize_' + size;
  gulp.task(resizeImageTask, function() {
    return gulp
      .src('./_src/img/jpg/toCompress/*.{JPG,jpg,png,tiff}')
      .pipe(
        imageResize({
          width: size,
          height: size,
          upscale: false
        })
      )
      .pipe(gulp.dest('./_src/img/jpg/' + size + '/'));
  });
  resizeImageTasks.push(resizeImageTask);
});

gulp.task('resize_images', resizeImageTasks);

// ************************************
// #BROWSER-SYNC
// ************************************
// Check for any change in the site folder
gulp.task('browser-sync', function() {
  // initializes browserSync
  browserSync.init('./_site/**', {
    server: { baseDir: './_site' },
    port: 4000,
    online: true,
    delay: 1000,
    open: false
  });
});

// ************************************
// #MAIN TASK
// ************************************
// Watch for any change
gulp.task('default', ['build', 'browser-sync'], function() {
  gulp.watch('./_src/js/**', ['copy-js']);
  gulp.watch('./_src/scss/**', ['sass']);
  gulp.watch('./_src/scss/*.*', ['sass']);
  gulp.watch('./_src/css/**', ['copy-css']);
  gulp.watch(
    [
      './_data/**',
      './_includes/**',
      './_layouts/**',
      './_pages/**',
      './_posts/**'
    ],
    ['build-jekyll']
  );
});
