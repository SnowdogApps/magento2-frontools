'use strict';
module.exports = function () {
  // Global variables
  const gulp    = this.gulp,
        plugins = this.opts.plugins,
        config  = this.opts.configs,
        themes  = plugins.getThemes();

  // Loop through all themes
  themes.forEach(name => {
    const theme = config.themes[name];

    // If current theme is a default Magento 2 frontend theme using less
    if (theme.default && theme.area === 'frontend' && theme.lang == 'less') {
      // Loop through locales
      theme.locale.forEach(locale => {
        // Copy documentation files
        gulp.src(config.projectPath + '/lib/web/css/docs/**/*')
          .pipe(gulp.dest(config.projectPath + theme.dest + '/' + locale + '/css/docs'));

        // Compile documentation .less files
        gulp.src([
          config.projectPath + theme.dest + '/' + locale + '/css/docs/**/*.less',
          '!' + config.projectPath + theme.dest + '/' + locale + '/css/docs/**/_*.less'
        ]).pipe(plugins.less())
          .pipe(gulp.dest(config.projectPath + theme.dest + '/' + locale + '/css/docs'));
      })
    }
  });
};
