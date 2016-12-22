
var gulp = require('gulp'),
    hb   = require('gulp-hb'), // gulp-handlebars plugin
    sass = require('gulp-sass'),
    concatinate = require('gulp-concat'),
    watch = require('gulp-watch'),
    minifyCss = require('gulp-minify-css'),
    htmlmin = require('gulp-htmlmin'),
    uncss = require('gulp-uncss'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename');

// Handlebars compiling of .hbs and .json data files
gulp.task('handlebars', function () {
    return gulp.src('./src/pages/**/*.hbs')
        .pipe(hb({
            data: './src/data/*.json',
            helpers: './node_modules/handlebars-layouts/index.js',
            partials: './src/assets/partials/**/*.hbs',
            bustCache: true
        }))
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(rename(function (path) {
          path.extname = ".html";
          return path;
        }))
        .pipe(gulp.dest('./build'));
});

// CSS task
gulp.task('styles', ['handlebars'], function () {
  gulp.src('./src/assets/styles/app.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(uncss({
        html: ['./build/**/*.html']
    }))
    .pipe(minifyCss({compatibility: 'ie9'}))
    .pipe(gulp.dest('./build'));
});

// JS task
gulp.task('scripts', function() {
  return gulp.src('./src/assets/scripts/*.js')
    .pipe(concatinate('app.js'))
    .pipe(gulp.dest('./build'));
});

// Images task
// Currently just places images located in the src/assets/images directory
// into the /build directory. Need to add minification later.
gulp.task('images', function() {
  gulp.src(['./src/assets/images/*.png',
            './src/assets/images/*.svg'])
    .pipe(imagemin({
            progressive: true
        }))
    .pipe(gulp.dest('./build'));
});

// Default (watch) task
gulp.task('watch', function() {
  // Watch .hbs/.html files
  gulp.watch([
    './src/assets/partials/**/*.hbs',
    './src/*.hbs',
    './src/data/*.json',
    './src/pages/**/*.hbs'],
  ['handlebars']);
  // Watch .scss files
  gulp.watch('./src/assets/styles/**/**/*.scss', ['styles']);
  // Watch .js files
  gulp.watch('./src/assets/scripts/**/*.js', ['scripts']);
  // Watch images
  gulp.watch([
    './src/assets/images/*.png',
    './src/assets/images/*.svg'
  ], ['images']);
});

gulp.task('default', ['handlebars', 'styles', 'scripts', 'images', 'watch']);
