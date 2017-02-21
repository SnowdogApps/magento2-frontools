'use strict';
module.exports = function(plugins, config, name) { // eslint-disable-line func-names
  // Return function that is executed inside of .pipe()
  return () => {
    const theme          = config.themes[name],
          srcBase        = config.projectPath + theme.src,
          gulpiconConfig = require('../helper/config-loader')('gulpicon.json', plugins, config);

    gulpiconConfig.dest            = config.projectPath + theme.src + gulpiconConfig.themeDest;
    gulpiconConfig.template        = config.projectPath + theme.src + gulpiconConfig.themeTemplate;
    gulpiconConfig.previewTemplate = config.projectPath + theme.src + gulpiconConfig.themePreviewTemplate;

    return plugins.gulpicon(plugins.globby.sync(srcBase + gulpiconConfig.themeSrc + '*.svg'), gulpiconConfig)();
  }
};
