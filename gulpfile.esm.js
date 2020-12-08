import { series } from 'gulp'

import pipelineHelper from './helpers/pipeline'

import { babel as babelTask } from './tasks/babel'
import { browserSync as browserSyncTask } from './tasks/browser-sync'
import { clean as cleanTask } from './tasks/clean'
import { csslint as cssLintTask } from './tasks/css-lint'
import { emailFix as emailFixTask } from './tasks/email-fix'
import { eslint as eslintTask } from './tasks/eslint'
import { inheritance as inheritanceTask } from './tasks/inheritance'
import { sasslint as sassLintTask } from './tasks/sass-lint'
import { setup as setupTask } from './tasks/setup'
import { styles as stylesTask } from './tasks/styles'
import { svg as svgTask } from './tasks/svg'
import { svginline as svgInlineTask } from './tasks/svginline'
import { watch as watchTask } from './tasks/watch'
import magepackBundleTask from './tasks/magepack-bundle'
import magepackGenerateTask from './tasks/magepack-generate'

export const babel = series(inheritanceTask, babelTask)
export const clean = cleanTask
export const csslint = cssLintTask
export const dev = series(pipelineHelper, inheritanceTask, babelTask, stylesTask, browserSyncTask, watchTask)
export const emailfix = emailFixTask
export const eslint = eslintTask
export const inheritance = inheritanceTask
export const sasslint = sassLintTask
export const setup = setupTask
export const styles = series(inheritanceTask, stylesTask)
export const svg = series(inheritanceTask, svgTask)
export const svginline = series(inheritanceTask, svgInlineTask)
export const watch = watchTask
export const magepackBundle = magepackBundleTask
export const magepackGenerate = magepackGenerateTask

export { default as default } from './tasks/default'
