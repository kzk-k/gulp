var gulp			= require('gulp');
var plumber			= require('gulp-plumber');
var notify			= require('gulp-notify');
var cache			= require('gulp-cached');
var sass			= require('gulp-sass');
var sassGlob		= require('gulp-sass-glob');
var cssbeautify		= require('gulp-cssbeautify');
var autoprefixer	= require('gulp-autoprefixer');
var please			= require('gulp-pleeease');

// reload
var connect			= require('gulp-connect-php');
var browserSync		= require('browser-sync');


// path
var assets = './public/assets';
var dir = {
	views: './fuel/app/views/**/*.php',
	scss: assets + '/scss/',
	css: assets + '/css/',
	critical: assets + '/scss/**/critical.scss'
}


gulp.task('sass', function() {
	gulp.src([dir.scss + '**/*.scss', '!' + dir.critical])
		.pipe(plumber({
			errorHandler: notify.onError('Error: <%= error.message %>')
		}))
		.pipe(cache(sass))
		.pipe(sassGlob())
		.pipe(sass())
		.pipe(autoprefixer({
			cascade: true
		}))
		.pipe(cssbeautify({
			indent: '\t'
		}))
		.pipe(gulp.dest(dir.css))
		.pipe(browserSync.stream());
});


gulp.task('sass_criticalRenderingPath', function() {
	gulp.src(dir.critical)
		.pipe(plumber({
			errorHandler: notify.onError('Error: <%= error.message %>')
		}))
		.pipe(cache(sass))
		.pipe(sassGlob())
		.pipe(sass())
		.pipe(autoprefixer({
			cascade: false
		}))
		.pipe(please({
			minifier: true
		}))
		.pipe(gulp.dest(dir.css))
		.pipe(browserSync.stream());
});



gulp.task('connect-sync', function() {
	connect.server({
		port: 8001
		, base: '../recruit_renewal'
	}, function() {
		browserSync({
			proxy: 'localhost:8001'
			, startPath: 'fuel/app/views/user/sp/top/index.php'
			, ghostMode: false
		});
	});
});

gulp.task('reload', function() {
	browserSync.reload();
});

// ファイル更新監視
gulp.task('default', ['connect-sync'], function() {
	gulp.watch(dir.views, ['reload']);
	gulp.watch([dir.scss + '**/*.scss', '!' + dir.critical], ['sass']);
	gulp.watch(dir.critical, ['sass_criticalRenderingPath']);
});