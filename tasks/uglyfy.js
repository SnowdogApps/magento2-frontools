module.exports = function() {
  // global vars
  var gulp    = this.gulp,
      plugins = this.opts.plugins,
      configs = this.opts.configs;

  // Gulp task body
  return gulp.src(configs.paths.scripts + '/**/*.js')
    .pipe(plugins.plumber({ errorHandler: plugins.notify.onError("Error: <%= error.message %>") }))
    .pipe(plugins.logger({ display: 'name'}))
    .pipe(plugins.uglify())
    .pipe(gulp.dest(configs.paths.build));
}
