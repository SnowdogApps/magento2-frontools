import gulp from 'gulp'
import rimraf from 'gulp-rimraf'

import { projectPath } from '../helpers/config.mjs'

export const clean = () => {
  // Remove all files under pub/static, except .htaccess
  return gulp.src([
    projectPath + 'pub/static/*',
    '!' + projectPath + 'pub/static/.htaccess'
  ], { read: false })
    .pipe(rimraf({ force: true }))
}
