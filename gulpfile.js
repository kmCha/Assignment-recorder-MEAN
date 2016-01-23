var less = require('gulp-less'),
	gulp = require('gulp'),
	path = require('path'),
    uglify = require('gulp-uglify'),
	del = require('del'),
	autoprefixer = require('gulp-autoprefixer'),
	rename = require('gulp-rename'),
    livereload = require('gulp-livereload'),
	minifyCSS = require('gulp-minify-css'),
	concat  = require('gulp-concat');

gulp.task('less', ['clean-less'], function() {
	return gulp.src('source/less/*.less')
		.pipe(less({
			paths: ['source/less/']
		}))
		.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
		.pipe(gulp.dest('source/css/'))
		.pipe(concat("main.css"))
		.pipe(minifyCSS())
		.pipe(gulp.dest('public/stylesheets/'));
});
gulp.task('clean-less', function() {
	return del(['public/stylesheets/main.css', 'source/css/*.css']);
});



gulp.task('scripts', ['main-min'], function() {
	return gulp.src('source/javascripts/dist/*.min.js')
		.pipe(concat('main.js'))
		.pipe(gulp.dest('public/javascripts/'));
});
gulp.task('main-min', ['clean-scripts'], function() {
  return gulp.src('source/javascripts/src/*.js')
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('source/javascripts/dist/'));
});
gulp.task('clean-scripts', function() {
	return del(['public/javascripts/main.js', 'source/javascripts/dist/*.js']);
});


gulp.task('default', ['less', 'scripts']);

gulp.task('watch', function() {
  // Watch .less files
  gulp.watch('source/less/*.less', ['less']);
  // Watch .js files
  gulp.watch('source/javascripts/src/*.js', ['scripts']);
  // Watch image files
  // gulp.watch('src/images/**/*', ['images']);
  // Create LiveReload server
  livereload.listen();
  // Watch any files in dist/, reload on change
  gulp.watch(['public/**']).on('change', livereload.changed);
});