'use strict'
module.exports = function() { // eslint-disable-line func-names
  // Global variables
  const gulp    = this.gulp
  const plugins = this.opts.plugins
  const config  = this.opts.configs
  const themes  = plugins.getThemes()
  const streams = plugins.mergeStream()

  themes.forEach(name => {
    plugins.util.log(
      plugins.util.colors.green('Runing CSS Lint on') + ' '
      + plugins.util.colors.blue(name) + ' '
      + plugins.util.colors.green('theme...')
    )
    streams.add(require('../helper/css-lint')(gulp, plugins, config, name))
  })

  return streams
}
