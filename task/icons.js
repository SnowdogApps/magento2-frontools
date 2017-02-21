'use strict';
module.exports = function() { // eslint-disable-line func-names
  // Global variables
  const plugins = this.opts.plugins,
        config  = this.opts.configs,
        themes  = plugins.getThemes();

  themes.forEach(name => {
    plugins.util.log(
      plugins.util.colors.green('Running Gulpicon on') + ' '
      + plugins.util.colors.blue(name) + ' '
      + plugins.util.colors.green('theme...')
    );
    require('../helper/gulpicon')(plugins, config, name)();
  });
};
