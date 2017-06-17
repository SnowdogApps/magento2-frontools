'use strict';
module.exports = function(resolve) { // eslint-disable-line func-names
  // Global variables
  const plugins = this.opts.plugins,
        config  = this.opts.configs,
        themes  = plugins.getThemes(),
        promises = [];

  themes.forEach(name => {
    promises.push(require('../helper/inheritance-resolver')(plugins, config, name));
  });

  Promise.all(promises).then(() => {
    resolve();
  });
};
