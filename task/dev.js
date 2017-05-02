'use strict';
module.exports = function() { // eslint-disable-line func-names
  // Global variables
  const plugins = this.opts.plugins;

  // Prevent runing inheritance task more than once
  plugins.util.env.pipeline = true;

  // Run all of these tasks in order
  plugins.runSequence(
    'inheritance',
    'babel',
    'styles',
    'watch',
    'browser-sync'
  );
};
