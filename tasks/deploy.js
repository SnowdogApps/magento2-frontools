module.exports = function() {
  // global vars
  var gulp    = this.gulp,
      plugins = this.opts.plugins,
      configs = this.opts.configs;

  // local plugins and configs
  var execSync = require('child_process').execSync;

  // each through configured themes and run deployment process
  Object.keys(configs.themes).forEach(name => {
    var theme = configs.themes[name];
    if (theme.default) {
      // each through all defined locales
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
};
