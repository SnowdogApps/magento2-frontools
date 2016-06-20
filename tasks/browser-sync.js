module.exports = function() {
  // Global variables
  var plugins = this.opts.plugins,
      config  = this.opts.configs;
  // Load browsersync with config from browser-sync.json

  config.browserSync = require('../helpers/config-loader')('browser-sync.json', plugins, config);

  plugins.browserSync.create();
  plugins.browserSync(config.browserSync);
};
