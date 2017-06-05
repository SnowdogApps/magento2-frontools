'use strict';
module.exports = function() { // eslint-disable-line func-names
  // Global variables
  const gulp    = this.gulp,
        plugins = this.opts.plugins,
        config  = this.opts.configs,
        themes  = plugins.getThemes();
  console.log(plugins.util.env);
  themes.forEach(name => {
    plugins.util.log(
      plugins.util.colors.green('Runing BackstopJs on') + ' '
      + plugins.util.colors.blue(name) + ' '
      + plugins.util.colors.green('theme...')
    );
    require('../helper/backstop')(gulp, plugins, config, name)();
  });
};
