import { series } from 'gulp'

import { babel as babelTask } from './tasks/babel'
import { inheritance as inheritanceTask } from './tasks/inheritance'

export const babel = series(inheritanceTask, babelTask)
export const inheritance = inheritanceTask

export { default as default } from './tasks/default'
