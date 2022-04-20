import gulp from "gulp";
import imagemin from "gulp-imagemin";
import pngquant from "imagemin-pngquant";
import mozjpeg from "imagemin-mozjpeg";

export default () =>
  gulp
    .src("./images/**/*.{png,jpg}")
    .pipe(
      imagemin()
      // imagemin([
      //   pngquant({
      //     quality: [0.75, 0.8],
      //     speed: 1,
      //   }),
      //   mozjpeg({ quality: 75 }),
      // ])
    )
    .pipe(gulp.dest("dist/"));
