'use strict';
module.exports = function() { // eslint-disable-line func-names
  // Global variables
  const plugins = this.opts.plugins,
        config  = this.opts.configs;

  // Prevent runing inheritance task more than once
  plugins.util.env.pipeline = true;

  plugins.runSequence('inheritance', 'styles', 'inky', 'inliner');
};
