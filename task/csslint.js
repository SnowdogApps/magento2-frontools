'use strict';
module.exports = function() { // eslint-disable-line func-names
  // Global variables
  const gulp            = this.gulp,
        plugins         = this.opts.plugins,
        config          = this.opts.configs,
        themes          = plugins.getThemes(),
        stylelintConfig = require('../helper/config-loader')('stylelint.yml', plugins, config);

  themes.forEach(name => {
    const theme = config.themes[name];
    theme.locale.forEach(locale => {
      gulp.src(config.projectPath + theme.dest + '/' + locale + '/**/*.css')
        .pipe(plugins.postcss([
          plugins.stylelint({
            config: stylelintConfig
          }),
          plugins.reporter({
            clearMessages: true,
            throwError: plugins.util.env.ci || false
          })
        ]));
    });
  });
};
