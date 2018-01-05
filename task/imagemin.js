'use strict';
module.exports = function() { // eslint-disable-line func-names
  // Global variables
  const gulp = this.gulp,
        plugins = this.opts.plugins,
        config  = this.opts.configs,
        themes  = plugins.getThemes();


  if (plugins.util.env.dir) {
      plugins.util.log(
        plugins.util.colors.green('Running imagemin on custom directory...')
      );
      require('../helper/imagemin')(gulp, plugins, config)();
  } else {
      themes.forEach(name => {
        plugins.util.log(
          plugins.util.colors.green('Running imagemin on') + ' '
          + plugins.util.colors.blue(name) + ' '
          + plugins.util.colors.green('theme...')
        );
        require('../helper/imagemin')(gulp, plugins, config, name)();
      });
  }
};
