module.exports = function() {
  // global vars
  var gulp    = this.gulp,
      plugins = this.opts.plugins,
      configs = this.opts.configs;

  return gulp.src(configs.currentSrc + '/**/*.less')
    .pipe(plugins.plumber({ errorHandler: plugins.notify.onError("Error: <%= error.message %>") }))
    .pipe(plugins.less({
      paths: ['../lib/web/css', '../lib/web/css/source', '../lib/web/css/source/lib'],
      // configs.fallbackSrc ?  configs.fallbackSrc + '/css' : ''
      plugins: [require('less-plugin-glob')]
    }))
    .pipe(gulp.dest(configs.currentDest));
};
