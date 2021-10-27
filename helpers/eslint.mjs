import path from 'path'
import fs from 'fs-extra'
import { globby } from 'globby'
import { ESLint } from 'eslint'
import progress from 'progress'
import log from 'fancy-log'
import colors from 'ansi-colors'

import configLoader from '../helpers/config-loader.mjs'
import { env, themes, projectPath } from '../helpers/config.mjs'

export default async (name, file) => {
  const theme = themes[name]
  const themePath = path.resolve(projectPath, theme.src) + '/'

  configLoader('.browserslistrc')

  const eslint = new ESLint({
    cwd: themePath,
    baseConfig: configLoader('.eslintrc.json'),
    resolvePluginsRelativeTo: process.cwd(),
    useEslintrc: false,
    fix: env.fix
  })

  const formatter = await eslint.loadFormatter('stylish')

  const paths = []

  if (file) {
    paths.push(file)
  }
  else {
    paths.push('**/*.js', '!**/node_modules/**')

    if (await fs.pathExists(themePath + '.eslintignore')) {
      const ignore = await fs.readFile(themePath + '.eslintignore', 'utf8')
      ignore.split('\n').forEach(path => {
        if (path) {
          paths.push('!' + path)
        }
      })
    }
  }

  const files = await globby(paths, { absolute: true, cwd: themePath })

  const progressBar = new progress(':percent |  ETA: :etas | :current/:total | [:bar]', {
    total: files.length,
    clear: true
  })

  const resultText = []

  await Promise.all(files.map(async filePath => {
    const code = await fs.readFile(filePath, 'utf8')
    const results = await eslint.lintText(code, { filePath })

    progressBar.tick()

    if (!results[0].messages.length) {
      return
    }

    if (env.fix) {
      await ESLint.outputFixes(results)
    }

    resultText.push(formatter.format(results))
  }))

  if (resultText.length) {
    log(resultText.join('\n'))

    if (env.ci) {
      process.exit(1)
    }
  }
  else {
    log(colors.green('ESLint found no problems!'))
  }
}
