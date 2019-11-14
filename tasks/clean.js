import { src } from 'gulp'
import rimraf from 'gulp-rimraf'

import { projectPath } from '../helpers/config'

export const clean = () => {
  // Remove all files under pub/static, except .htaccess
  return src([
    projectPath + 'pub/static/*',
    '!' + projectPath + 'pub/static/.htaccess'
  ], { read: false })
    .pipe(rimraf({ force: true }))
}
