'use strict';
module.exports = function(themeName, config) {
  function getParentThemeDir(themeName) {
    const theme = config.themes[themeName];
    if (theme.parent) {
      const path = [config.projectPath + config.themes[theme.parent].src + '/web/css/'];
      return path.concat(getParentThemeDir(theme.parent));
    }
    else {
      return [];
    }
  }
  return getParentThemeDir(themeName);
};
