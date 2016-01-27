module.exports = function() {
  // global vars
  var gulp    = this.gulp,
      plugins = this.opts.plugins,
      configs = this.opts.configs;

  return gulp.src(configs.currentSrc + '/**/*.scss')
    .pipe(plugins.sass())
    .pipe(gulp.dest(configs.currentDest));
};
