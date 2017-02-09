'use strict';
module.exports = function() { // eslint-disable-line func-names

  const gulp = this.gulp,
	  config     = this.opts.configs,
    plugins    = this.opts.plugins,
    themes     = plugins.getThemes(),
    sassdoc 	 = require('sassdoc');

  themes.forEach(name => {

    const theme = config.themes[name],
    options = {
      // Path to new folder in theme called docs
      dest: config.projectPath + theme.src + '/docs',
      verbose: true,
      // Optional description at top of every page. 
      descriptionPath: config.projectPath + theme.src + '/README.md'
    };

    theme.locale.forEach(locale => {
      gulp.src(config.projectPath + theme.src + '/styles/**/*.scss')
      .pipe(sassdoc(options));
    });
  });
};
