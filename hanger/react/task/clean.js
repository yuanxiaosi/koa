const gulp = require('gulp');
const del = require('del');

gulp.task('clean', function (cb) {
	return del(['./src/build/chunk','./src/build/entry','./src/build/img'], {force: true}, cb);
});
 