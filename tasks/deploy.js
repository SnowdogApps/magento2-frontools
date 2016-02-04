module.exports = function() {
  // global vars
  var gulp    = this.gulp,
      plugins = this.opts.plugins,
      configs = this.opts.configs;

  // local plugins and configs
  var execSync = require('child_process').execSync;

  // local vars
  var themeName = plugins.util.env.theme || false,
      themes = themeName ? [themeName] : Object.keys(configs.themes);

  if (!configs.themes[themeName].default) {
    plugins.util.log(
      plugins.util.colors.red.bold('[Warining] ')
      + plugins.util.colors.yellow('This tasks is designed only for LESS themes which use ')
      + plugins.util.colors.blue('@magento-import')
    );
  }
  else {
    themes.forEach(name => {
      configs.themes[name].locale.forEach(locale => {
        if (configs.themes[name].default) {
          theme.locale.forEach(locale => {
            // if it's default theme, create symlinks to styles files via Magento CLI
            // porting "@magento-import" to node.js might be time consumig
            // and it's not so usefull for front-end devs
            // execSync to keep process synchronous and wait till CLI do the job
            execSync('../bin/magento dev:source-theme:deploy'
            + ' --type=' + theme.lang
            + ' --locale=' + locale
            + ' --area=' + theme.area
            + ' --theme=' + theme.vendor + '/' + theme.name
            + ' ' + theme.files.join(' '));
          });
        }
      });
    });
  }
}
