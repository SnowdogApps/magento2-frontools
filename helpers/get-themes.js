'use strict';
module.exports = function (plugins, config) {
  return function () {
    const themeName = plugins.util.env.theme || false,
          themes    = config.themes;

    // If themes is empty we throw a configuration error
    if(themes.length === 0) {
      throw new plugins.util.PluginError({
        'plugin' : 'config',
        'message': plugins.errorMessage('You have to create <magento root>/dev/tools/frontools/configs/themes.json')
      })
    }

    if (themeName && !themes[themeName]) {
      throw new plugins.util.PluginError({
        plugin : 'config',
        message: plugins.errorMessage('Theme provided using --theme <theme-name> is not available in <magento root>/dev/tools/frontools/configs/themes.json')
      });
    }

    return themeName ? themes[themeName] : themes;
  }
};
