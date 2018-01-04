'use strict';
module.exports = function() { // eslint-disable-line func-names
  // Global variables
  const gulp    = this.gulp,
        plugins = this.opts.plugins,
        config  = this.opts.configs,
        themes  = plugins.getThemes(),
        streams = plugins.mergeStream();

  plugins.runSequence('styles', 'webpack-build', 'webpack-dist');

  return streams;
};
