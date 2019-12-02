import browserSync from 'browser-sync'

import configLoader from '../helpers/config-loader'
import { browserSyncInstances } from '../helpers/config'

export const dev = callback => {
  let browserSyncConfig = configLoader('browser-sync.json')

  if (!Array.isArray(browserSyncConfig)) {
    browserSyncConfig = [browserSyncConfig]
  }

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

    browserSyncInstances[instance] = browserSync.create()
    browserSyncInstances[instance].init(bsConfig)
  })
  callback()
}
