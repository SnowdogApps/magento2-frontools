const gulp   = require('gulp'),
      eslint = require('gulp-eslint');

gulp.task('eslint', () => {
  return gulp.src(['../**/*.js', '!../**/node_modules/**'])
    .pipe(eslint({ configFile: '.eslintrc' }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});
