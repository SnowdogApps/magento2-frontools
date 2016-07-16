'use strict';
module.exports = function() {
  // Global variables
  const plugins = this.opts.plugins;

  // Clean pub/static, run source-theme:deploy and then compile styles
  plugins.util.env.prod = true;
  plugins.runSequence(['clean', 'deploy', 'styles']);
};
