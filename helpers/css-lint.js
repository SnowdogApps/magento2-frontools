import path from 'path'
import { src } from 'gulp'
import globby from 'globby'
import stylelint from 'stylelint'
import postcss from 'gulp-postcss'
import plumber from 'gulp-plumber'
import gulpIf from 'gulp-if'
import notify from 'gulp-notify'
import logger from 'gulp-logger'
import reporter from 'postcss-reporter'

import { env, themes, projectPath } from './config'
import configLoader from './config-loader'

export default (name, file) => {
  const theme = themes[name]
  const srcBase = path.join(projectPath, theme.dest)
  const stylelintConfig = configLoader('stylelint.yml')
  const files = globby.sync(srcBase + '/**/*.css')

  return src(file ? file : files.length ? files : '.')
    .pipe(gulpIf(
      !env.ci,
      plumber({
        errorHandler: notify.onError('Error: <%= error.message %>')
      })
    ))
    .pipe(postcss([
      stylelint({
        config: stylelintConfig
      }),
      reporter({
        clearReportedMessages: true,
        throwError: env.ci || false
      })
    ]))
    .pipe(logger({
      display   : 'name',
      beforeEach: 'Theme: ' + name + ' ' + 'File: ',
      afterEach : ' - CSS Lint finished.'
    }))
}
