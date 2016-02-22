module.exports = function() {
  // global vars
  var gulp    = this.gulp,
      plugins = this.opts.plugins,
      configs = this.opts.configs;

  Object.keys(configs.themes).forEach(name => {
    var theme = configs.themes[name];
    if (theme.default && theme.area === 'frontend') {
      theme.locale.forEach(locale => {
        gulp.src('../lib/web/css/docs/**/*')
          .pipe(gulp.dest(theme.dest + '/' + locale + '/css/docs'));

        gulp.src([
          theme.dest + '/' + locale + '/css/docs/**/*.less',
          '!' + theme.dest + '/' + locale + '/css/docs/**/_*.less'
        ])
          .pipe(plugins.less())
          .pipe(gulp.dest(theme.dest + '/' + locale + '/css/docs'));
      })
    }
  });
};
