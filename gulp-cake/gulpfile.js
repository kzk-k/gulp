const gulp				= require('gulp');
const plumber			= require('gulp-plumber');
const notify			= require('gulp-notify');
const cache				= require('gulp-cached');
// reload
const connect			= require('gulp-connect-php');
const browserSync		= require('browser-sync');
// css
const sass				= require('gulp-sass');
const sassGlob			= require("gulp-sass-glob");
const stylus			= require('gulp-stylus');
const postcss			= require('gulp-postcss');
const autoprefixer		= require('autoprefixer');
const cssbeautify		= require('gulp-cssbeautify');
const minifycss			= require('gulp-clean-css');
const sourcemaps		= require('gulp-sourcemaps');


const projectName = 'gulp-cake';
const path = {
	views: './gulp-cake/src/Template/**/*.ctp',
	scss: './gulp-cake/webroot/welfare/scss/**/*.scss',
	stylus: './gulp-cake/webroot/welfare/stylus/**/*.styl',
	css: './gulp-cake/webroot/welfare/css/',
	critical: './gulp-cake/stylus/**/critical.styl'
}

const postcssPlugin = [autoprefixer()];


function sassFunc() {
	return gulp.src([path.scss, '!' + path.critical])
		.pipe(plumber({
			errorHandler: notify.onError('Error: <%= error.message %>')
		}))
		// .pipe(sourcemaps.init( { largeFile: true } ))
		.pipe(cache(sass))
		.pipe(sassGlob()) // Sassの@importにおけるglobを有効にする
		// .pipe(sass( { outputStyle: 'expanded' } ))
		.pipe(sass())
		.pipe(postcss(postcssPlugin))
		.pipe(cssbeautify({
			indent: '\t'
		}))
		// .pipe(sourcemaps.write('./sourcemaps/'))
		.pipe(gulp.dest(path.css))
		.pipe(browserSync.stream());
};

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
		, base: '../gulp-cake/'
	}, function() {
		browserSync.init({
			proxy: 'http://localhost:8000/'
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
	gulp.watch(path.scss, sassFunc);
	gulp.watch(path.stylus, stylusFunc);
	// gulp.watch(path.critical, headCSS);
}


// npx gulp
exports.default = gulp.parallel([connectSync, watchFiles]);

// 単独実行用（パーシャルファイルのコンパイル）
exports.sass = gulp.series([sassFunc]);
exports.stylus = gulp.series([stylusFunc]);

// 単独実行用（head内展開のCSSコンパイル）
// exports.headCSS = gulp.series([headCSS]);