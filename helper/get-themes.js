'use strict';
module.exports = function(plugins, config) { // eslint-disable-line func-names
  return function() { // eslint-disable-line func-names
    const themeName = plugins.util.env.theme || false,
          themes    = Object.keys(config.themes);

    // If themes is empty we throw a configuration error
    if (themes.length === 0) {
      throw new plugins.util.PluginError({
        'plugin' : 'config',
        'message': plugins.errorMessage('You have to create themes.json')
      })
    }

    if (themeName && themes.indexOf(themeName) === -1) {
      throw new plugins.util.PluginError({
        plugin : 'config',
        message: plugins.errorMessage(themeName + ' theme is not defined in themes.json')
      });
    }

    return themeName ? [themeName] : themes;
  }
};
