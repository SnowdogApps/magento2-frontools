'use strict';
module.exports = function() { // eslint-disable-line func-names

  const gulp = this.gulp,
        config = this.opts.configs,
        plugins = this.opts.plugins,
        themes = plugins.getThemes(),
        sassdoc = require('sassdoc');

  themes.forEach(name => {

    const theme = config.themes[name],
          options = {
            dest: config.projectPath + theme.src + '/docs',
            verbose: true,
            descriptionPath: config.projectPath + theme.src + '/README.md'
          };

    gulp.src(config.projectPath + theme.src + '/styles/**/*.scss')
    .pipe(sassdoc(options));

  });
};
