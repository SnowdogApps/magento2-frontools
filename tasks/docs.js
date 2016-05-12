module.exports = function() {
  // global vars
  var gulp    = this.gulp,
      plugins = this.opts.plugins,
      config  = this.opts.configs;

  Object.keys(config.themes).forEach(name => {
    var theme = config.themes[name];
    if (theme.default && theme.area === 'frontend' && theme.lang == 'less') {
      theme.locale.forEach(locale => {
        gulp.src(config.projectPath + '/lib/web/css/docs/**/*')
          .pipe(gulp.dest(config.projectPath + theme.dest + '/' + locale + '/css/docs'));

        gulp.src([
          config.projectPath + theme.dest + '/' + locale + '/css/docs/**/*.less',
          '!' + config.projectPath + theme.dest + '/' + locale + '/css/docs/**/_*.less'
        ])
          .pipe(plugins.less())
          .pipe(gulp.dest(config.projectPath + theme.dest + '/' + locale + '/css/docs'));
      })
    }
  });
};
