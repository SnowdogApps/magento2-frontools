import path from 'path'
import fs from 'fs-extra'
import { globbySync } from 'globby'
import yaml from 'js-yaml'

import errorMessage from './error-message.mjs'
import { projectPath } from './config.mjs'

function getContent(filePath) {
  if (filePath.endsWith('.browserslistrc')) {
    process.env.BROWSERSLIST_CONFIG = path.resolve(filePath)
    return
  }

  if (filePath.endsWith('.yml')) {
    return yaml.load(fs.readFileSync(filePath))
  }

  if (filePath.endsWith('.json')) {
    return JSON.parse(fs.readFileSync(filePath))
  }

  if (filePath.endsWith('.js')) {
    return require(filePath)
  }
}

export default (file, failOnError = true) => {
  const externalPath = path.join(projectPath, 'dev/tools/frontools/config/', file)

  // Check if file exists inside the config directory
  if (globbySync(externalPath).length) {
    return getContent(externalPath)
  }

  if (globbySync('config/' + file).length) {
    return getContent('config/' + file)
  }

  if (failOnError) {
    throw new Error(errorMessage('You have to create ' + file))
  }

  return {}
}
