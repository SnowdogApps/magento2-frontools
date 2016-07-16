'use strict';
module.exports = function (plugins, config) {
  return function (name) {
    const themeName = name || false;
    const themes = Object.keys(config.themes);

    if (themes.length === 0) {
      throw new plugins.util.PluginError({
        plugin : 'config',
        message: plugins.errorMessage('You have to create <magento root>/dev/tools/frontools/configs/themes.json or run "gulp setup"')
      });
    }

    if (themeName && themes.indexOf(themeName) === -1) {
      throw new plugins.util.PluginError({
        plugin : 'config',
        message: plugins.errorMessage('Theme provided using --theme <theme-name> is not available in <magento root>/dev/tools/frontools/configs/themes.json')
      });
    }

    return themeName ? themes[themeName] : themes;
  }
};