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
    await fs.copy(`${partytownLibPath}/partytown.js`, `${publicPath}/partytown.min.js`)
    await fs.copy(`${partytownLibPath}/debug/partytown.js`, `${publicPath}/debug/partytown.min.js`)
  } catch (err) {
    console.error(err)
  }
}
