'use strict';
module.exports = function() { // eslint-disable-line func-names
  // Global variables
  const plugins = this.opts.plugins,
        config  = this.opts.configs;

  // Prevent runing inheritance task more than once
  plugins.util.env.pipeline = true;

  let browserSyncConfig = require('../helper/config-loader')('browser-sync.json', plugins, config);

  if (!Array.isArray(browserSyncConfig)) {
    browserSyncConfig = [browserSyncConfig];
  }

  plugins.browserSyncInstances = {};

  plugins.runSequence('inheritance', 'babel', 'styles', () => {
    // Setup browser-sync
    browserSyncConfig.forEach((item, index) => {
      const instance = `browserSyncInstance${index}`;

      plugins.browserSyncInstances[instance] = plugins.browserSync.create();
      plugins.browserSyncInstances[instance].init(item);
    });

    plugins.runSequence('watch');
  });
};
