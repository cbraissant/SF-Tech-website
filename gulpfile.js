// ************************************
// DEPENDENCIES
// ************************************
const { src, dest, series, parallel, watch, task } = require('gulp');
const changed = require('gulp-changed');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const minify = require('gulp-minify');
const imageResize = require('gulp-image-resize');
const imagemin = require('gulp-imagemin');
const child = require('child_process');
const gutil = require('gulp-util');
const del = require('del');
const rename = require('gulp-rename');
const print = require('gulp-print').default;

// ************************************
// PATH
// ************************************
var paths = {};
paths.build_dir = './_site/';
paths.js_source = './_src/js/**/*.js';
paths.js_dest = './_site/assets/js';
paths.scss_source = './_src/scss/**/*.scss';
paths.css_source = './_src/css/**';
paths.css_dest = './_site/assets/css';
paths.images_source = './_src/img/test/*.*';
paths.images_dest = './_site/assets/img';
paths.jekyll_source = [
  './_data/**',
  './_includes/**/*.*',
  './_layouts/**/*.*',
  './_pages/**',
  './_posts/**',
];

// ************************************
// PICTURES
// ************************************
function cleanImages() {
  del([paths.images_dest]);
}

function resizeImages(done) {
  let stream = src(paths.images_source)
    // check if the image has changed
    .pipe(changed(paths.images_dest))
    // copy the original
    .pipe(dest(paths.images_dest));

  let sizes = [400, 800, 1024, 1680, 1920];
  sizes.forEach(function (size) {
    // resize
    stream
      .pipe(
        imageResize({
          width: size,
          height: size,
          quality: 0.6,
          noProfile: true,
          upscale: false,
          interlace: true,
        })
      )
      .pipe(print())
      // compress
      .pipe(
        imagemin([
          imagemin.gifsicle({ interlaced: true }),
          imagemin.mozjpeg({ quality: 75, progressive: true }),
          imagemin.optipng({ optimizationLevel: 5 }),
          imagemin.svgo({
            plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
          }),
        ])
      )
      // rename
      .pipe(
        rename(function (path) {
          path.basename += '_' + size;
        })
      )
      // save
      .pipe(dest(paths.images_dest));
  });
  return stream;
}

function optimImages() {
  return (
    src(paths.images_dest + '/*.*')
      .pipe(print())
      // compress
      .pipe(
        imagemin([
          imagemin.gifsicle({ interlaced: true }),
          imagemin.mozjpeg({ quality: 75, progressive: true }),
          imagemin.optipng({ optimizationLevel: 5 }),
          imagemin.svgo({
            plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
          }),
        ])
      )
      .pipe(dest(paths.images_dest))
  );
}

// ************************************
// CLEAN
// ************************************
function clean() {
  del([paths.build_dir]);
}

// ************************************
// #BROWSER-SYNC
// ************************************
function serve(done) {
  browserSync.init('./_site/**', {
    server: { baseDir: paths.build_dir },
    port: 4000,
    online: true,
    delay: 1000,
    open: false,
  });
  done();
}

function reload(done) {
  browserSync.reload();
  done();
}

// ************************************
// JAVASCRIPT
// ************************************
function build_js() {
  return src(paths.js_source)
    .pipe(changed(paths.js_dest))
    .pipe(dest(paths.js_dest));
}

// ************************************
// CSS
// ************************************
function build_scss() {
  return src(paths.scss_source)
    .pipe(sass().on('error', sass.logError)) //compile SASS
    .pipe(
      autoprefixer({
        cascade: true,
      })
    )
    .pipe(dest(paths.css_dest))
    .pipe(browserSync.stream())
    .on('error', gutil.log);
}

function build_css() {
  return src(paths.css_source)
    .pipe(changed(paths.css_dest))
    .pipe(dest(paths.css_dest))
    .pipe(browserSync.stream())
    .on('error', gutil.log);
}

// ************************************
// JEKYLL
// ************************************
function build_jekyll() {
  const jekyll = child.spawn('jekyll', [
    'build',
    // '--watch',
    '--incremental', // Rebuild only the pages which have changed
    '--drafts',
  ]);
}

function jekyll(done) {
  spawn('jekyll', [
    'build',
    // '--watch',
    '--incremental', // Rebuild only the pages which have changed
    '--drafts',
  ])
    .on('close', reload)
    .on('exit', done);
}

// ************************************
// BUILDER AND WATCHER
// ************************************

//Do everything once!
function watcher() {
  watch(paths.jekyll_source, series(jekyll, reload));
  watch(paths.js_source, series(build_js, reload));
  watch(paths.scss_source, series(build_scss, reload));
  watch(paths.css_source, series(build_css, reload));
  watch(paths.images_source, series(resizeImages, reload));
}

// ************************************
// MAIN TASK
// ************************************
exports.clean = clean;
exports.cleanImages = cleanImages;
exports.processImages = series(resizeImages);
exports.optimImages = optimImages;
exports.builder = parallel(
  series(build_jekyll, reload),
  series(build_js, reload),
  series(build_scss, reload),
  series(build_css, reload)
);
exports.default = series(serve, watcher);
