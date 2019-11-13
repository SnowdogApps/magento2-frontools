import path from 'path'
import fs from 'fs-extra'
import parseArgs from 'minimist'

import configLoader from './config-loader'

export const env = parseArgs(process.argv.slice(2))
export const projectPath = path.join(fs.realpathSync('../../../'), '/')
export const tempPath = path.join(projectPath, 'var/view_preprocessed/frontools/')
export const themes = configLoader('themes.json', false)
export const browserSyncInstances = {}
