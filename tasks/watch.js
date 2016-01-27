module.exports = function() {
  // global vars
  var gulp    = this.gulp,
      plugins = this.opts.plugins,
      configs = this.opts.configs;

  // Gulp task body
  gulp.watch(configs.paths.sass + '/**', ['sass']);
  gulp.watch(configs.paths.template, reload);
  gulp.watch(configs.paths.build + '/*.js', reload);
}
