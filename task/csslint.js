'use strict';
module.exports = function() { // eslint-disable-line func-names
  // Global variables
  const gulp    = this.gulp,
        plugins = this.opts.plugins,
        config  = this.opts.configs,
        themes  = plugins.getThemes();

  themes.forEach(name => {
    plugins.util.log(
      plugins.util.colors.green('Runing CSS Lint on') + ' '
      + plugins.util.colors.blue(name) + ' '
      + plugins.util.colors.green('theme...')
    );
    require('../helper/css-lint')(gulp, plugins, config, name)();
  });
};
