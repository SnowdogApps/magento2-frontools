'use strict';
module.exports = function () {
  // Global variables
  const plugins = this.opts.plugins,
        config  = this.opts.configs;

  plugins.browserSync.create();

  // Load browsersync with config from browser-sync.json
  plugins.browserSync(require('../helpers/config-loader')('browser-sync.json', plugins, config));
};
