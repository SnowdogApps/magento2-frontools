import { src, dest } from 'gulp'
import path from 'path'
import gulpIf from 'gulp-if'
import plumber from 'gulp-plumber'
import notify from 'gulp-notify'
import logger from 'gulp-logger'
import replace from 'gulp-replace'

import { env, projectPath, themes } from './config'

export default name => {
  const production = env.prod || false
  const theme = themes[name]
  const srcBase = path.join(projectPath, theme.dest)
  const emailFilename = production ? 'email-inline.min.css' : 'email-inline.css'

  return src(srcBase + '/**/*/' + emailFilename, { base: './' })
    .pipe(gulpIf(
      !env.ci,
      plumber({
        errorHandler: notify.onError('Error: <%= error.message %>')
      })
    ))
    .pipe(logger({
      display : 'rel',
      beforeEach: 'Email styles from: ',
      afterEach: ' has been fixed!'
    }))
    .pipe(replace('@charset "UTF-8";', ''))
    .pipe(dest('./'))
}
