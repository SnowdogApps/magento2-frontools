import PluginError from 'plugin-error'

import errorMessage from './error-message'
import { env, themes } from './config'

const themeName = env.theme || false
const themesNames = Object.keys(themes)

// If themes is empty we throw a configuration error
if (themesNames.length === 0) {
  throw new PluginError({
    'plugin' : 'config',
    'message': errorMessage('You have to create themes.json')
  })
}

if (themeName && themesNames.indexOf(themeName) === -1) {
  throw new PluginError({
    plugin : 'config',
    message: errorMessage(themeName + ' theme is not defined in themes.json')
  })
}

export default themeName ? [themeName] : themesNames
