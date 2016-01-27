module.exports = function() {
  // global vars
  var gulp    = this.gulp,
      plugins = this.opts.plugins,
      configs = this.opts.configs;

  // local plugins and configs
  var execSync = require('child_process').execSync;

  function deploy(name) {
    var theme = configs.themes[name];
    configs.currentTheme = name; // pass theme name to global configs object

    // each through all defined locales
    theme.locale.forEach(locale => {
      // path to destination "pub/static" folder
      configs.currentDest = '../pub/static/' + theme.area + '/' + theme.vendor + '/' + theme.name + '/' + locale;

      // if it's not custom theme, create symlinks to styles files via Magento CLI
      // porting "@magento-import" to node.js might be time consumig
      // and it's not so usefull for front-end devs
      if (!theme.custom) {
        // execSync to keep process synchronous and wait till CLI do the job
        execSync('../bin/magento dev:source-theme:deploy'
        + ' --type="' + theme.lang + '"'
        + ' --locale="' + locale + '"'
        + ' --area="' + theme.area + '"'
        + ' --theme="' + theme.vendor + '/' + theme.name + '" '
        + theme.files.toString().replace(/\,/g, ' '));

        // for default themes source and destination is the same,
        // because we symlink all styles into pub/static
        configs.currentSrc = configs.currentDest;
      }
      else {
        // check if theme is composer package to set proper source paths
        if (theme.package) {
          configs.currentSrc = '../vendor/' + theme.package;
        }
        else {
          configs.currentSrc = '../app/design/' + theme.area + '/' + theme.vendor + '/' + theme.name;
        }
      }

      // run gulp task by name given in configuration as "lang" i.e. "less" will run taks in "/tasks/less.js"
      plugins.runSequence(theme.lang);
    });
  }

  // get vlue of "--theme" flag
  var themeName = plugins.util.env.theme || false;

  // if user pass theme name, compile only this theme
  if (themeName) {
    // check if theme of given name exist
    if (configs.themes[themeName]) {
      // run deployment process
      deploy(themeName);
    }
    else {
      // if theme not exist in cofiguration print error
      plugins.util.log(plugins.util.colors.red('Error! Theme "' + themeName + '" is not configured.'));
    }
  }
  else {
    // each through configured themes and run deployment process
    Object.keys(configs.themes).forEach(theme => deploy(theme));
  }
};
