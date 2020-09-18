import mergeStream from 'merge-stream'
import log from 'fancy-log'
import colors from 'ansi-colors'

import helper from '../helpers/eslint'
import themes from '../helpers/get-themes'

export const eslint = () => {
  const streams = mergeStream()
  themes().forEach(name => {
    log(`${colors.green('Runing eslint on')} ${colors.blue(name)} ${colors.green('theme...')}`)
    streams.add(helper(name))
  })

  return streams
}
