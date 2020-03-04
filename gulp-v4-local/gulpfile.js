const gulp				= require('gulp');
const plumber			= require('gulp-plumber');
const notify			= require('gulp-notify');
const cache				= require('gulp-cached');
// reload
const connect			= require('gulp-connect-php');
const browserSync		= require('browser-sync');
// css
const stylus			= require('gulp-stylus');
const postcss			= require('gulp-postcss');
const autoprefixer		= require('autoprefixer');
const cssbeautify		= require('gulp-cssbeautify');
const minifycss			= require('gulp-clean-css');

const path = {
	views: './*.php',
	stylus: './stylus/**/*.styl',
	css: './css/',
	critical: './stylus/**/critical.styl'
}

const postcssPlugin = [autoprefixer()];


function stylusFunc() {
	return gulp.src([path.stylus, '!' + path.critical])
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

function headCSS() {
	return gulp.src(path.critical)
		.pipe(plumber({
			errorHandler: notify.onError('Error: <%= error.message %>')
		}))
		.pipe(cache(sass))
		.pipe(sassGlob())
		.pipe(sass())
		.pipe(postcss(postcssPlugin))
		.pipe(cssbeautify({
			indent: '\t'
		}))
		// .pipe(minifycss())
		.pipe(gulp.dest(path.css))
		.pipe(browserSync.stream());
};

function connectSync() {
	connect.server({
		port: 8001
		, base: '../gulp-v4-local/'
	}, function() {
		browserSync.init({
			proxy: 'localhost:8001/'
			, startPath: 'index.php'
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
	gulp.watch(path.stylus, stylusFunc);
	// gulp.watch(path.critical, headCSS);
}


// npx gulp
exports.default = gulp.parallel([connectSync, watchFiles]);

// 単独実行用（パーシャルファイルのコンパイル）
exports.stylus = gulp.series([stylusFunc]);

// 単独実行用（head内展開のCSSコンパイル）
// exports.headCSS = gulp.series([headCSS]);