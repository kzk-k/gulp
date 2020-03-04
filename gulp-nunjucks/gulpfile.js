const gulp				= require('gulp');
const plumber			= require('gulp-plumber');
const notify			= require('gulp-notify');
const cache				= require('gulp-cached');
// reload
const connect			= require('gulp-connect-php');
const browserSync		= require('browser-sync');
// css
const sass				= require('gulp-sass');
const sassGlob			= require('gulp-sass-glob');
const stylus			= require('gulp-stylus');
const postcss			= require('gulp-postcss');
const autoprefixer		= require('autoprefixer');
const cssbeautify		= require('gulp-cssbeautify');
const minifycss			= require('gulp-clean-css');
// html
const nunjucksRender	= require('gulp-nunjucks-render');


const src = {
	views: './src/nunjucks/**/*.njk',
	stylus: './src/stylus/**/*.styl',
	scss: './src/scss/**/*.scss',
	// critical: './stylus/**/critical.styl'
	// critical: './scss/**/critical.scss'
}

const dist = {
	views: './dist/',
	css: './dist/'
}

function njkFunc() {
	return gulp.src([src.views, '!src/nunjucks/**/_*.njk'])
		.pipe(plumber({
			errorHandler: notify.onError('Error: <%= error.message %>')
		}))
		.pipe(nunjucksRender({
			path: ['src/nunjucks/']
		}))
		.pipe(gulp.dest(dist.views))
		.pipe(browserSync.stream());
};

const postcssPlugin = [autoprefixer()];


function stylusFunc() {
	return gulp.src([src.stylus, '!' + src.critical])
		.pipe(plumber({
			errorHandler: notify.onError('Error: <%= error.message %>')
		}))
		.pipe(cache(stylus))
		.pipe(stylus())
		.pipe(postcss(postcssPlugin))
		.pipe(cssbeautify({
			indent: '\t'
		}))
		.pipe(gulp.dest(dist.css))
		.pipe(browserSync.stream());
};

function sassFunc() {
	return gulp.src([src.scss, '!' + src.critical])
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
		.pipe(gulp.dest(dist.css))
		.pipe(browserSync.stream());
}

function headCSS() {
	return gulp.src(src.critical)
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
		.pipe(gulp.dest(dist.css))
		.pipe(browserSync.stream());
};

function connectSync() {
	connect.server({
		port: 8001
		, base: './dist/'
	}, function() {
		browserSync.init({
			proxy: 'localhost:8001/'
			, startPath: 'top/'
			, ghostMode: false
		});
	});
};

function reload(done) {
	browserSync.reload();
	done();
};

function watchFiles() {
	gulp.watch(src.views, njkFunc);
	gulp.watch(src.stylus, stylusFunc);
	gulp.watch(src.scss, sassFunc);
	// gulp.watch(path.critical, headCSS);
}


// npx gulp
exports.default = gulp.parallel([connectSync, watchFiles]);

// 単独実行用（パーシャルファイルのコンパイル）
exports.stylus = gulp.series([stylusFunc]);
exports.sass = gulp.series([sassFunc]);
exports.html = gulp.series([njkFunc]);

// 単独実行用（head内展開のCSSコンパイル）
// exports.headCSS = gulp.series([headCSS]);