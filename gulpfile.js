var less = require('gulp-less'),
	gulp = require('gulp'),
	path = require('path'),
    uglify = require('gulp-uglify'),
	del = require('del'),
	autoprefixer = require('gulp-autoprefixer'),
	rename = require('gulp-rename'),
    livereload = require('gulp-livereload'),
	minifyCSS = require('gulp-minify-css');

gulp.task('less', function() {
	return gulp.src('source/less/*.less')
		.pipe(less({
			paths: ['source/less/']
		}))
		.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
		.pipe(gulp.dest('source/css/'))
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(minifyCSS())
		.pipe(gulp.dest('public/stylesheets/'));
});

gulp.task('scripts', ['clean'], function() {
  return gulp.src('source/javascripts/*.js')
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('public/javascripts/'));
});

gulp.task('clean-less', function() {
	return del(['public/stylesheets/']);
});

gulp.task('default', ['less']);

gulp.task('watch', function() {
  // Watch .less files
  gulp.watch('source/less/*.less', ['less']);
  // Watch .js files
  // gulp.watch('src/scripts/**/*.js', ['scripts']);
  // Watch image files
  // gulp.watch('src/images/**/*', ['images']);
  // Create LiveReload server
  livereload.listen();
  // Watch any files in dist/, reload on change
  gulp.watch(['public/**']).on('change', livereload.changed);
});