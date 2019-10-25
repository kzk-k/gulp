const gulp = require('gulp'),
	  svgSprite = require('gulp-svg-sprite');

// path
const imgDir = './img/*.svg';
const spriteDir = '../dest/';


// mode config
const view  = {
	// cssでsvg指定
	mode: {
		view: {
			render: {
				scss: {
					dest: spriteDir + '_svg_sprite.scss',// sass出力先
				},
			},
			sprite: spriteDir + 'for_css.svg', // svg出力先
			prefix: ".svg-",
			dimensions: false, // sass上でのサイズ用classを生成しない
			bust: false // キャッシュ用パラメータを削除
		}
	}
};

const symbol = {// symbol mode
	mode: {
		symbol: {
			sprite: `${spriteDir}for_html.svg`,
		}
	},
	shape : {
		transform: [
			{
				svgo: {
					plugins: [
						{ 'removeTitle': true },
						{ 'removeStyleElement': true }, // styleを削除
						{ 'removeAttrs': { 'attrs': 'fill' } }, // fillを削除
						{ 'removeXMLNS': true },
						{ 'removeDimensions': true }
					]
				}
			}
		]
	},
	svg : {
		xmlDeclaration: false
	}
};


gulp.task('svg', () => {
	gulp.src(imgDir)
		.pipe(svgSprite(symbol))
		.pipe(gulp.dest('.'));
	gulp.src(imgDir)
		.pipe(svgSprite(view))
		.pipe(gulp.dest('.'));
});

gulp.task('default', ['svg']);