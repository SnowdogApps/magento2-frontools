import bs from 'browser-sync'

import configLoader from '../helpers/config-loader'
import { browserSyncInstances } from '../helpers/config'

export const browserSync = async() => {
  let browserSyncConfig = configLoader('browser-sync.json')

  if (!Array.isArray(browserSyncConfig)) {
    browserSyncConfig = [browserSyncConfig]
  }

  // Setup browser-sync
  await Promise.all(browserSyncConfig.map((bsConfig, index) => {
    const instance = `browserSyncInstance${index}`

    if (!bsConfig.port) {
      bsConfig.port = 3000 + (100 * index)
    }

    bsConfig.ui = bsConfig.ui ? bsConfig.ui : {}

    if (!bsConfig.ui.port) {
      bsConfig.ui.port = 3000 + (100 * index) + 1
    }

    return new Promise(resolve => {
      browserSyncInstances[instance] = bs.create()
      browserSyncInstances[instance].init(bsConfig, () => resolve())
    })
  }))
}
