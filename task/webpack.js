const _ = require('lodash');
const gulp = require('gulp');
const webpack = require('gulp-webpack');

gulp.task('webpack-dev', function () {
	return gulp.src('../package.json') // whatever sources
		.pipe(webpack(_.defaultsDeep({
			watch: true,
			output: {
				chunkFilename: 'chunk/[name].js'
			}
		}, require('./webpack.config.js'))))
		.pipe(gulp.dest('./src/root/build/static'));
});

gulp.task('webpack', function () {
	return gulp.src('../package.json') // whatever sources
		.pipe(webpack(require('./webpack.config.js')))
		.pipe(gulp.dest('./src/root/build/static'));
});
