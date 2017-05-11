const gulp = require('gulp');
const uglify = require('gulp-uglify');
const htmlmin = require('gulp-htmlmin');

gulp.task('uglify', function () {
	return gulp.src('./src/build/static/**/*.js', {
		base: './src/build'
	})
		.pipe(uglify())
		.pipe(gulp.dest('./src/build'));
});

gulp.task('htmlmin', function () {
	return gulp.src('./src/build/template/**/*.html', {
		base: './src/build'
	})
		.pipe(htmlmin({collapseWhitespace: true}))
		.pipe(gulp.dest('./src/build'));
});

gulp.task('minify', ['uglify', 'htmlmin']);
