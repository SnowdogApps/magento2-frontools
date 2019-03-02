'use strict';
module.exports = function() { // eslint-disable-line func-names
  // Global variables
  const plugins = this.opts.plugins,
        config  = this.opts.configs,
        env     = plugins.util.env;
  env.prod = true;
  env.disableMaps = true;

  plugins.runSequence('inheritance', 'babel', 'svg', 'styles');
};
