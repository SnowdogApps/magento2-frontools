import path from 'path'
import gulp from 'gulp'
import { globbySync } from 'globby'
import eslint from 'gulp-eslint'
import plumber from 'gulp-plumber'
import gulpIf from 'gulp-if'
import notify from 'gulp-notify'
import logger from 'gulp-logger'

import { env, themes, projectPath } from './config.mjs'
import configLoader from './config-loader.mjs'

export default (name, file) => {
  const theme = themes[name]
  const srcBase = path.join(projectPath, theme.dest)
  const eslintConfig = configLoader('eslint.json')
  const files = globbySync(srcBase + '/**/*.js')

  return gulp.src(file ? file : files.length ? files : '.')
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
