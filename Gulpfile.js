var gulp			= require('gulp'),
		sass 			=	require('gulp-sass'),
		neat			=	require('node-neat').includePaths,
		watch			=	require('gulp-watch'),
		jshint		=	require('gulp-jshint'),
		uglify 		=	require('gulp-uglify'),
		rename		=	require('gulp-rename'),
		minifyCss = require('gulp-minify-css'),
		sourcemaps = require('gulp-sourcemaps'),
		concat		=	require('gulp-concat');

var input = {
    scss: './source/sass/*.scss',
    js: 	'./source/js/*.js'
};

var output = {
    stylesheets: './public/dist/css/',
    js: 	'./public/dist/js/'
};

/*http://stackoverflow.com/questions/21602332/catching-gulp-mocha-errors#answers*/
function handleError(err) {
  console.log(err.toString());
  this.emit('end');
}

gulp.task('sass', function() {
	return gulp.src(input.scss)
		.pipe(sass({
			includePaths: neat
		}))
		.on('error', handleError)
		.pipe(sourcemaps.init()) // Process the original sources
			.pipe(minifyCss())
		.pipe(sourcemaps.write()) // Add the map to modified source.
		.pipe(gulp.dest(output.stylesheets));
});

gulp.task('jshint', function() {
	return gulp.src(input.js)
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('build-js', function() {
	return gulp.src(input.js)
		.pipe(sourcemaps.init())
			.pipe(concat('main.js'))
			.pipe(rename({suffix: '.min'}))
			.pipe(uglify())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(output.js))
});



gulp.task('watch', function() {
	gulp.watch(input.scss, ['sass']);
	gulp.watch(input.js,	 ['jshint', 'build-js']);
});

gulp.task('default', ['sass', 'jshint', 'build-js', 'watch']);