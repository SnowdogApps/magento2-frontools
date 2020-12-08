import { src } from 'gulp'
import logger from 'gulp-logger'
import sassInlineSvg from 'm2-sass-inlinesvg'

import { projectPath, themes } from './config'

export default name => {
  const theme = themes[name]
  const stylesDir = theme.stylesDir ? theme.stylesDir : 'styles'

  return src(projectPath + theme['src'] + '/**/icons/**/*.svg')
    .pipe(sassInlineSvg({
      destDir: projectPath + theme['src'] + '/' + stylesDir + '/svg',
      prefix: 'default'
    }))
    .pipe(logger({
      display: 'name',
      beforeEach: 'Theme: ' + name + ' ',
      afterEach: ' Compiled!'
    }))
}
