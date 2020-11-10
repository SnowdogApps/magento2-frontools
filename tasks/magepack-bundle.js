import bundle from 'magepack/lib/bundle'

import getThemes from '../helpers/get-themes'
import { env, projectPath, themes } from '../helpers/config'

function getThemesGlobPattern() {
  const themesNames = getThemes()

  if (themesNames.length === 1) {
    return `${projectPath}${themes[themesNames[0]].dest}/*`
  }

  return `${projectPath}{${themesNames.map(name => themes[name].dest).join(',')}}/*`
}

export default async function() {
  const configPath = env.c || env.config
  const themesGlobPattern = getThemesGlobPattern()
  await bundle(configPath, themesGlobPattern)
}
