'use strict';
module.exports = function() { // eslint-disable-line func-names
  // Global variables
  const gulp     = this.gulp,
        plugins  = this.opts.plugins,
        config   = this.opts.configs,
        themes   = plugins.getThemes(),
        streams  = plugins.mergeStream(),
        emailFix = require('../helper/email-fix');

  themes.forEach(name => {
    plugins.util.log(
      plugins.util.colors.green('Runing email-fix on') + ' '
      + plugins.util.colors.blue(name) + ' '
      + plugins.util.colors.green('theme...')
    );
    streams.add(emailFix(gulp, plugins, config, name));
  });

  return streams;
};
