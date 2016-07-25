'use strict';
module.exports = function(themeName, config, plugins) {
  function getParentThemeDir(themeName) {
    let theme = config.themes[themeName];

    if (theme.parent) {
      let src   = config.themes[theme.parent].src,
          paths = plugins.globby.sync(
            config.projectPath + src + '/**/',
            { ignore: '/**/node_modules/**' }
          );

      return paths.concat(getParentThemeDir(theme.parent));
    }
    else {
      return [];
    }
  }
  return getParentThemeDir(themeName);
};
