const gulp = require('gulp');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
// reload
const browserSync = require('browser-sync');
// css
const sass = require('gulp-sass')(require('sass'));
const sassGlob = require('gulp-sass-glob');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
// const cssbeautify = require('gulp-cssbeautify');

const src = {
	views: './**/*.html',
	sass: './assets/sass/**/*.scss',
};
const dist = {
	css: './assets/css/',
};
const postcssPlugin = [autoprefixer()];

function sassBuild() {
	return (
		gulp
			.src([src.sass])
			.pipe(
				plumber({
					errorHandler: notify.onError('Error: <%= error.message %>'),
				})
			)
			.pipe(sassGlob())
			.pipe(sass())
			.pipe(postcss(postcssPlugin))
			// .pipe(
			// 	cssbeautify({
			// 		indent: '\t',
			// 	})
			// )
			.pipe(gulp.dest(dist.css))
			.pipe(browserSync.stream())
	);
}

function reload(done) {
	browserSync.reload();
	done();
}

function connectSync(done) {
	browserSync.init({
		server: {
			baseDir: './',
			index: 'index.html',
		},
		startPath: 'top.html',
	});
	done();
}

function watchFiles() {
	gulp.watch(src.views, reload);
	gulp.watch(src.sass, sassBuild);
}

// npx gulp
exports.default = gulp.parallel([connectSync, watchFiles]);

// 単独実行用（パーシャルファイルのコンパイル）
exports.sass = gulp.series([sassBuild]);
