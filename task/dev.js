'use strict'
module.exports = function() { // eslint-disable-line func-names
  // Global variables
  const plugins = this.opts.plugins
  const config  = this.opts.configs

  // Prevent runing inheritance task more than once
  plugins.util.env.pipeline = true

  let browserSyncConfig = require('../helper/config-loader')('browser-sync.json', plugins, config)

  if (!Array.isArray(browserSyncConfig)) {
    browserSyncConfig = [browserSyncConfig]
  }

  plugins.browserSyncInstances = {}

  plugins.runSequence('inheritance', 'babel', 'styles', () => {
    // Setup browser-sync
    browserSyncConfig.forEach((bsConfig, index) => {
      const instance = `browserSyncInstance${index}`

      if (!bsConfig.port) {
        bsConfig.port = 3000 + (100 * index)
      }

      bsConfig.ui = bsConfig.ui ? bsConfig.ui : {}

      if (!bsConfig.ui.port) {
        bsConfig.ui.port = 3000 + (100 * index) + 1
      }

      plugins.browserSyncInstances[instance] = plugins.browserSync.create()
      plugins.browserSyncInstances[instance].init(bsConfig)
    })

    plugins.runSequence('watch')
  })
}
