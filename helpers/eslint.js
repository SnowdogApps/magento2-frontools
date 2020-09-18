import path from 'path'
import { src } from 'gulp'
import globby from 'globby'
import eslint from 'gulp-eslint'
import plumber from 'gulp-plumber'
import gulpIf from 'gulp-if'
import notify from 'gulp-notify'
import logger from 'gulp-logger'

import { env, themes, projectPath } from './config'
import configLoader from './config-loader'

export default (name, file) => {
  const theme = themes[name]
  const srcBase = path.join(projectPath, theme.dest)
  const eslintConfig = configLoader('eslint.json')
  const files = globby.sync(srcBase + '/**/*.js')

  return src(file ? file : files.length ? files : '.')
    .pipe(gulpIf(
      !env.ci,
      plumber({
        errorHandler: notify.onError('Error: <%= error.message %>')
      })
    ))
    .pipe(eslint(eslintConfig))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
    .pipe(logger({
      display   : 'name',
      beforeEach: 'Theme: ' + name + ' ' + 'File: ',
      afterEach : ' - ESLint finished.'
    }))
}
