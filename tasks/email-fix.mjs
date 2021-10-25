
import mergeStream from 'merge-stream'
import colors from 'ansi-colors'
import log from 'fancy-log'

import helper from '../helpers/email-fix.mjs'
import themes from '../helpers/get-themes.mjs'

export const emailFix = () => {
  const streams = mergeStream()
  themes().forEach(name => {
    log(
      `${colors.green('Runing email-fix on')} ${colors.blue(name)} ${colors.green('theme...')}`
    )
    streams.add(helper(name))
  })

  return streams
}
