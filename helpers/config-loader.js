import path from 'path'
import fs from 'fs-extra'
import globby from 'globby'
import yaml from 'js-yaml'

import errorMessage from './error-message'
import { projectPath } from './config'

export default (file, plugins, failOnError = true) => {
  const externalPath = path.join(projectPath, 'dev/tools/frontools/config/', file)

  // Check if file exists inside the config directory
  if (globby.sync(externalPath).length) {
    if (file.includes('yml')) {
      return yaml.safeLoad(fs.readFileSync(externalPath))
    }
    else {
      return JSON.parse(fs.readFileSync(externalPath))
    }
  }

  if (globby.sync('config/' + file).length) {
    if (file.includes('yml')) {
      return yaml.safeLoad(fs.readFileSync('config/' + file))
    }
    else {
      return JSON.parse(fs.readFileSync('config/' + file))
    }
  }

  if (failOnError) {
    throw new plugins.util.PluginError({
      'plugin' : 'config',
      'message': errorMessage('You have to create ' + file)
    })
  }

  return {}
}
