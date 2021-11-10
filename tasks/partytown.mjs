import fs from 'fs-extra'
import { themes, projectPath } from '../helpers/config.mjs'
import getThemes from '../helpers/get-themes.mjs'

export default async function() {
  const themesNames = getThemes()
  const theme = themes[themesNames[0]]

  const partytownLibPath = './node_modules/@builder.io/partytown/lib'
  const publicPath = `${projectPath}${theme.dest}/${theme.locale}/partytown`

  try {
    console.log(`Copying files from ${partytownLibPath} to ${publicPath}`)
    await fs.copy(partytownLibPath, publicPath)
  } catch (err) {
    console.error(err)
  }
}
