import mergeStream from 'merge-stream'
import log from 'fancy-log'
import colors from 'ansi-colors'

import helper from '../helpers/sass-lint.mjs'
import themes from '../helpers/get-themes.mjs'

export const sasslint = () => {
  const streams = mergeStream()
  themes().forEach(name => {
    log(`${colors.green('Runing SASS Lint on')} ${colors.blue(name)} ${colors.green('theme...')}`)
    streams.add(helper(name))
  })

  return streams
}
