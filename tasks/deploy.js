module.exports = function() {
  // global vars
  var gulp    = this.gulp,
      plugins = this.opts.plugins,
      config  = this.opts.configs;

  // local plugins and config
  const execSync = require('child_process').execSync;

  // local vars
  var themeName = plugins.util.env.theme || false,
      themes = themeName ? [themeName] : Object.keys(config.themes);

  if (!!config.themes[themeName] && !config.themes[themeName].default) {
    plugins.util.log(
      plugins.util.colors.red.bold('[Warining] ')
      + plugins.util.colors.yellow('This tasks is designed only for LESS themes which use ')
      + plugins.util.colors.blue('@magento-import')
    );
  }
  else {
    themes.forEach(name => {
      config.themes[name].locale.forEach(locale => {
        if (config.themes[name].default) {
          var theme = config.themes[name];
          theme.locale.forEach(locale => {
            // if it's default theme, create symlinks to styles files via Magento CLI
            // porting "@magento-import" to node.js might be time consumig
            // and it's not so usefull for front-end devs
            // execSync to keep process synchronous and wait till CLI do the job
            execSync(config.projectPath + 'bin/magento dev:source-theme:deploy'
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
