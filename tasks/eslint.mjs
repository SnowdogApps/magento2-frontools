import log from 'fancy-log'
import colors from 'ansi-colors'

import helper from '../helpers/eslint.mjs'
import themes from '../helpers/get-themes.mjs'

export const eslint = async () => {
  await Promise.all(
    themes().map(async name => {
      log(`${colors.green('Runing ESLint on')} ${colors.blue(name)} ${colors.green('theme...')}`)
      await helper(name)
    })
  )
}
