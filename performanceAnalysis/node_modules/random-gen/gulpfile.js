var gulp = require('gulp');
var plumber = require('gulp-plumber');
var concat = require('gulp-concat');
var babel = require('gulp-babel');
var jasmine = require('gulp-jasmine');

gulp.task('scripts', function() {
  return gulp
    .src([
      'lib/head.js',
      'src/variables.js',
      'src/charsets.js',
      'src/helpers.js',
      'src/public-api.js',
      'src/exports.js',
      'lib/tail.js'
    ])
    .pipe(plumber())
    .pipe(concat('random-gen.js'))
    .pipe(babel({ presets: ['es2015'] }))
    .pipe(gulp.dest('.'));
});

gulp.task('jasmine', ['scripts'], function() {
  return gulp
    .src('tests/**/*')
    .pipe(jasmine());
});

gulp.task('watch', function() {
  gulp.watch('src/**/*', ['jasmine']);
});

gulp.task('default', ['jasmine', 'watch']);
