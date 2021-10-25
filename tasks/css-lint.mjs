import mergeStream from 'merge-stream'
import log from 'fancy-log'
import colors from 'ansi-colors'

import helper from '../helpers/css-lint.mjs'
import themes from '../helpers/get-themes.mjs'

export const csslint = () => {
  const streams = mergeStream()
  themes().forEach(name => {
    log(`${colors.green('Runing CSS Lint on')} ${colors.blue(name)} ${colors.green('theme...')}`)
    streams.add(helper(name))
  })

  return streams
}
