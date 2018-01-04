'use strict';
module.exports = function() { // eslint-disable-line func-names
  // Global variables
  const gulp    = this.gulp,
        plugins = this.opts.plugins,
        config  = this.opts.configs,
        themes  = plugins.getThemes();

  plugins.util.log(
    plugins.util.colors.green('Running BackstopJs')
  );

  require('../helper/backstop')(gulp, plugins, config)();
};
