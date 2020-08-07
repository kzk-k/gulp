const gulp = require('gulp');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
// const cache				= require('gulp-cached');
// reload
const connect = require('gulp-connect-php');
const browserSync = require('browser-sync');
// css
const sass = require('gulp-sass');
const sassGlob = require('gulp-sass-glob');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssbeautify = require('gulp-cssbeautify');
// const minifycss			= require('gulp-clean-css');


const src = {
	views: './resources/views/',
	sass: './public/sass/**/*.scss',
}
const dist = {
	css: './public/css/',
}
const postcssPlugin = [autoprefixer()];


function sassFunc() {
	return gulp.src([src.sass])
		.pipe(plumber({
			errorHandler: notify.onError('Error: <%= error.message %>')
		}))
		// .pipe(cache(sass))
		.pipe(sassGlob())
		.pipe(sass())
		.pipe(postcss(postcssPlugin))
		.pipe(cssbeautify({
			indent: '\t'
		}))
		.pipe(gulp.dest(dist.css))
		.pipe(browserSync.stream());
}

function connectSync() {
	connect.server({
		port: 8009
		, base: '../gulp-laravel/'
	}, function () {
		browserSync.init({
			proxy: 'localhost:8009/'
			, startPath: 'resources/views/pagesName/'
			, ghostMode: false
		});
	});
};

function reload(done) {
	browserSync.reload();
	done();
};

function watchFiles() {
	gulp.watch(src.views, reload);
	gulp.watch(src.sass, sassFunc);
}


// npx gulp
exports.default = gulp.parallel([connectSync, watchFiles]);

// 単独実行用（パーシャルファイルのコンパイル）
exports.sass = gulp.series([sassFunc]);
