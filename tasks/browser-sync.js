module.exports = function() {
  // global vars
  var gulp    = this.gulp,
      plugins = this.opts.plugins,
      config  = this.opts.configs;

  // Task body

  config.browserSync = require('../helpers/config-loader')('browser-sync.json', plugins, config);

  plugins.browserSync.create();
  plugins.browserSync(config.browserSync);
};
