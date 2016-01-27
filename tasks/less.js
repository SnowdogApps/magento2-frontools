module.exports = function() {
  // global vars
  var gulp    = this.gulp,
      plugins = this.opts.plugins,
      configs = this.opts.configs;

  // local configs
  // less compiler is dumb as f*ck
  // can't figure out what files to process when pass paths like "theme/**/*.less"
  var lessFiles = [];
  configs.themes[configs.currentTheme].files.forEach(file => lessFiles.push(configs.currentSrc + file));

  return gulp.src(lessFiles)
    .pipe(plugins.plumber({ errorHandler: plugins.notify.onError("Error: <%= error.message %>") }))
    .pipe(plugins.less())
    .pipe(gulp.dest(configs.currentDest));
};
