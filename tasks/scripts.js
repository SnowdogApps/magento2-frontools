module.exports = function() {
  // global vars
  var gulp    = this.gulp,
      plugins = this.opts.plugins,
      configs = this.opts.configs;

  // Gulp task body
  gulp.watch(configs.paths.custom, function(event) {
    return gulp.src(event.path)
      .pipe(plugins.plumber({ errorHandler: plugins.notify.onError("ESLint found problems") }))
      .pipe(plugins.logger({ display: 'name' }))
      .pipe(eslint(esLintSettings))
      .pipe(eslint.format())
      .pipe(uglify())
      .pipe(gulp.dest(configs.paths.build));
  });
}
