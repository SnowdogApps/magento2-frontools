import path from 'path'
import fs from 'fs-extra'
import globby from 'globby'
import yaml from 'js-yaml'

import errorMessage from './error-message.mjs'
import { projectPath } from './config.mjs'

function getContent(filePath) {
  if (filePath.endsWith('.yml')) {
    return yaml.safeLoad(fs.readFileSync(filePath))
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
  if (globby.sync(externalPath).length) {
    return getContent(externalPath)
  }

  if (globby.sync('config/' + file).length) {
    return getContent('config/' + file)
  }

  if (failOnError) {
    throw new Error(errorMessage('You have to create ' + file))
  }

  return {}
}
