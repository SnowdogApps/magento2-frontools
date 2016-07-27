'use strict';
module.exports = function() { // eslint-disable-line func-names
  // Global variables
  const gulp           = this.gulp,
        plugins        = this.opts.plugins,
        config         = this.opts.configs,
        themes         = plugins.getThemes(),
        sassLintConfig = require('../helper/config-loader')('sass-lint.yml', plugins, config);

  themes.forEach(name => {
    const theme = config.themes[name];
    gulp.src([config.projectPath + theme.src + '/**/*.scss', '!/**/node_modules/**'])
      .pipe(plugins.sassLint(sassLintConfig))
      .pipe(plugins.sassLint.format())
      .pipe(plugins.if(plugins.util.env.ci, plugins.sassLint.failOnError()));
  });
};
