const gulp				= require('gulp');
const plumber			= require('gulp-plumber');
const notify			= require('gulp-notify');
const cache				= require('gulp-cached');

// reload
const connect			= require('gulp-connect-php');
const browserSync		= require('browser-sync');

// sass
const sass				= require('gulp-sass');
const sassGlob			= require('gulp-sass-glob');
const postcss			= require('gulp-postcss');
const autoprefixer		= require('autoprefixer');
const cssbeautify		= require('gulp-cssbeautify');
const minifycss			= require('gulp-clean-css');


// 
const path = {
	views: './fuel/app/views/**/*.php',
	scss: './public/assets/scss/**/*.scss',
	css: './public/assets/css/',
	critical: './public/assets/scss/**/critical.scss'
}

const postcssPlugin = [autoprefixer()];


function sassFunc() {
	return gulp.src([path.scss, '!' + path.critical])
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
		.pipe(gulp.dest(path.css))
		.pipe(browserSync.stream());
}

function sass_criticalRenderingPathFunc() {
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
	const view = 'fuel/app/views/user/pc/';
	connect.server({
		port: 8001
		, base: '../gulp_v4_sass/'
	}, function() {
		browserSync({
			proxy: 'localhost:8001/'
			, startPath: view + 'guide/index.php'
			, ghostMode: false
		});
	});
}

function reload(done) {
	browserSync.reload();
	done();
}

function watchFiles() {
	gulp.watch(path.views, reload);
	gulp.watch([path.scss, '!' + path.critical], sassFunc);
	gulp.watch(path.critical, sass_criticalRenderingPathFunc);
}

const watch = gulp.parallel([watchFiles, connectSync]);
exports.default = watch;


// 単独実行用（パーシャルファイルのコンパイル）
gulp.task('sass', function(done) {
	sassFunc();
	done();
});

gulp.task('cr', function(done) {
	sass_criticalRenderingPathFunc();
	done();
});
