const gulp = require('gulp');
const concat = require('gulp-concat');


gulp.task('default', function () {
    gulp.watch("src/*.js", function () {
        return gulp.src('./src/*.js')
            .pipe(concat('index.js'))
            .pipe(gulp.dest('./dist/'));
    });
});
