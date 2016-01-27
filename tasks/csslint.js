module.exports = function() {
  // global vars
  var gulp    = this.gulp,
      plugins = this.opts.plugins,
      configs = this.opts.configs;

  // Gulp task body
  return gulp.src(configs.paths.css + '/*.css')
    .pipe(plugins.plumber({ errorHandler: plugins.notify.onError("Error: <%= error.message %>") }))
    .pipe(plugins.logger({ display: 'name'}))
    .pipe(plugins.if(gutil.env.full, csslint(), csslint(cssLintSettings)))
    .pipe(plugins.csslint.reporter(customReporter));
}
