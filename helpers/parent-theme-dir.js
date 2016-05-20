module.exports = function(themeName, config) {
  function getParentThemeDir(themeName) {
    var theme = config.themes[themeName];
    if (theme.parent) {
      var path = [config.projectPath + config.themes[theme.parent].src + '/web/css/'];
      return path.concat(getParentThemeDir(theme.parent));
    }
    else {
      return [];
    }
  }
  return getParentThemeDir(themeName);
}
