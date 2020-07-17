// gulpfile.js
'use strict';

/************************************
        REQUIRED PACKAGES
 ************************************/

// Required packages using npm:
// npm install <package-name> --save-dev
const gulp = require('gulp');
const browserSync = require('browser-sync').create();

// Jekyll
const cp = require('child_process');
const { groupCollapsed } = require('console');
// const gutil = require('gulp-util');

// SASS and CSS
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');

// Images
const gulpImagemin = require('gulp-imagemin');
const gulpNewer = require('gulp-newer');
const gulpResizer = require('gulp-images-resizer');
const pngquant = require('imagemin-pngquant');
const mozjpeg = require('imagemin-mozjpeg');

/************************************
        CONSTANTS
 ************************************/
const siteRoot = '_site';
const jekyllFiles = [
    './_data/**',
    './_includes/**',
    './_layouts/**',
    './_pages/**',
    'posts/**',
];

/************************************
        JEKYLL
 ************************************/

// Task to build Jekyll
function buildJekyll(cb) {
    cp.exec('bundle exec jekyll build --incremental --drafts', function (
        err,
        stdout,
        stderr
    ) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
}
exports.jekyll = buildJekyll;

// Task to clean _site/ and other Jekyll caches
function cleanJekyll(cb) {
    cp.exec('bundle exec jekyll clean', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
}

/************************************
        CSS
 ************************************/
function buildSass(cb) {
    return (
        gulp
            .src('./_src/scss/main.scss')
            // Compile SASS files
            .pipe(sass().on('error', sass.logError))
            // Auto-prefix css styles for cross browser compatibility
            .pipe(
                autoprefixer({
                    cascade: false,
                })
            )
            .pipe(gulp.dest('./_site/assets/css'))
    );
}
exports.sass = buildSass;

/************************************
        JAVASCRIPT
 ************************************/
function buildJavascript(cb) {
    return gulp.src('./_src/js/**/*.js').pipe(gulp.dest('./_site/assets/js'));
}
exports.javascript = buildJavascript;

/************************************
        BROWSER-SYNC
 ************************************/
function startBrowser(cb) {
    // initializes browserSync
    browserSync.init('./_site/**', {
        server: { baseDir: './_site' },
        port: 4000,
        online: true,
        delay: 5000,
        open: false,
    });
}
exports.serve = startBrowser;

/************************************
        IMAGES
 ************************************/

// Copy the original images to the corresponding site folder
function copyOriginalImages(cb) {
    return gulp
        .src('./_images/**/*.{jpg, jpeg, png}')
        .pipe(gulpNewer('./_site/assets/images/original'))
        .pipe(gulp.dest('./_site/assets/images/original'));
}

// create an array of tasks
var resizeImageTasks = [];

// create a task for each size
[1920, 800, 320].forEach(function (size) {
    // name the task (f.ex "resize_1920")
    var resizeImageTask = 'resize_' + size;
    // create the task
    gulp.task(resizeImageTask, function () {
        return gulp
            .src('./_site/assets/images/original/*.{jpg, jpeg, png}')
            .pipe(gulpNewer('./_site/assets/images/' + size + '/'))
            .pipe(
                gulpResizer({
                    verbose: true,
                    width: size,
                    height: size,
                    noCrop: true,
                })
            )
            .pipe(gulpImagemin([mozjpeg(), pngquant()]))
            .pipe(gulp.dest('./_site/assets/images/' + size + '/'));
    });
    resizeImageTasks.push(resizeImageTask);
});

const buildImages = gulp.series(copyOriginalImages, resizeImageTasks);
exports.images = buildImages;

/************************************
        MAIN TASK AND WATCHERS
 ************************************/
function watchSass(cb) {
    gulp.watch('./_src/scss/**/*.{scss,css}', buildSass);
}

function watchJavascript(cb) {
    gulp.watch('./_src/js/**/*.{js}', buildJavascript);
}

function watchJekyll(cb) {
    gulp.watch(
        [
            './_data/**/*.*',
            './_includes/**/*.*',
            './_layouts/**/*.*',
            './_pages/**/*.*',
            './_posts/**/*.*',
        ],
        buildJekyll
    );
}

function watchImages(cb) {
    gulp.watch(
        './_images/**/*.*',
        gulp.series(copyOriginalImages, resizeImageTasks)
    );
}

exports.default = gulp.series(
    gulp.series(buildImages, buildSass, buildJavascript, buildJekyll),
    gulp.parallel(
        startBrowser,
        watchImages,
        watchJekyll,
        watchSass,
        watchJavascript
    )
);
