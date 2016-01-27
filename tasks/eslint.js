module.exports = function() {
  // global vars
  var gulp    = this.gulp,
      plugins = this.opts.plugins,
      configs = this.opts.configs;

  // Gulp task body
  if (plugins.gutil.env.file) {
    gulp.watch('../**/' + gutil.env.file + '.js', function(event) {
      gulp.src(event.path)
        .pipe(plugins.plumber({ errorHandler: plugins.notify.onError("ESLint found problems") }))
        .pipe(plugins.logger({ display: 'name' }))
        .pipe(eslint(esLintSettings))
        .pipe(eslint.format());
    });
  }
  else {
    plugins.gutil.log(plugins.gutil.colors.red.bold('ERROR: Specify file name, for example: ')
                      + plugins.gutil.colors.green('gulp eslint --file formValidator-2.2.8'));
  }
}
