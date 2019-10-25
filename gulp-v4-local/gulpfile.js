const gulp				= require('gulp');
const plumber			= require('gulp-plumber');
const notify			= require('gulp-notify');
const cache				= require('gulp-cached');
const stylus			= require('gulp-stylus');
const cssbeautify		= require('gulp-cssbeautify');
const postcss			= require('gulp-postcss');
const autoprefixer		= require('autoprefixer');
// reload
const connect			= require('gulp-connect-php');
const browserSync		= require('browser-sync').create();

// const assets = './public/assets';
const path = {
	views: './*.php',
	stylus: './stylus/',
	css: './css/',
}

const postcssPlugin = [ autoprefixer() ];


function stylusFunc() {
	return gulp.src(path.stylus + '**/*.styl')
		.pipe(plumber({
			errorHandler: notify.onError('Error: <%= error.message %>')
		}))
		.pipe(cache(stylus))
		.pipe(stylus())
		.pipe(postcss(postcssPlugin))
		.pipe(cssbeautify({
			indent: '\t'
		}))
		.pipe(gulp.dest(path.css))
		.pipe(browserSync.stream());
};


function connectSync() {
	connect.server({
		port: 8001
		, base: '../test_gulp_v4/'
	}, function() {
		browserSync.init({
			proxy: 'localhost:8001'
			// , startPath: 'index.php'
			, ghostMode: false
		});
	});
};

function reload(done) {
	browserSync.reload();
	done();
};

function watchFiles() {
	gulp.watch(path.views, reload);
	gulp.watch(path.stylus + '**/*.styl', stylusFunc);
}


const watch = gulp.parallel([watchFiles, connectSync]);
exports.default = watch;