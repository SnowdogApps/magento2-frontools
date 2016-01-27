module.exports = function() {
  // global vars
  var gulp    = this.gulp,
      plugins = this.opts.plugins,
      configs = this.opts.configs;

  function deploy(name) {
    var theme = configs.themes[name];
    configs.currentTheme = name;
    theme.locale.forEach(function(locale) {
      if (theme.package) {
        configs.currentSrc = '../vendor/' + theme.package;
      }
      else {
        configs.currentSrc = '../app/design/' + theme.area + '/' + theme.vendor + '/' + theme.name;
      }
      configs.currentDest = '../pub/static/' + theme.area + '/' + theme.vendor + '/' + theme.name + '/' + locale;

      if (theme.fallback) {
        var fallbackTheme = configs.themes[theme.fallback];
        if (fallbackTheme.package) {
          configs.fallbackSrc = '../vendor/' + fallbackTheme.package;
        }
        else {
          configs.fallbackSrc = '../app/design/' + fallbackTheme.area + '/' + fallbackTheme.vendor + '/' + fallbackTheme.name;
        }
      }
      plugins.runSequence(theme.lang);
    });
  }

  var themeName = plugins.util.env.theme || false;

  if (themeName) {
    if (configs.themes[themeName]) {
      deploy(themeName);
    }
    else {
      plugins.util.log(plugins.util.colors.red('Error! Theme "' + themeName + '" is not configured.'));
    }
  }
  else {
    Object.keys(configs.themes).forEach(function(key) {
      deploy(key);
    });
  }
};
