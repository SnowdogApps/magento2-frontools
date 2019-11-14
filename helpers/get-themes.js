import { env } from './config'
import errorMessage from './error-message'
import configLoader from './config-loader'

export default () => {
  const themes = configLoader('themes.json')

  const themeName = env.theme || false
  const themesNames = Object.keys(themes)

  if (themeName && themesNames.indexOf(themeName) === -1) {
    throw new Error(errorMessage(themeName + ' theme is not defined in themes.json'))
  }

  return themeName ? [themeName] : themesNames
}
