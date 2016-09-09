'use strict';
module.exports = function (themeName, config) { // eslint-disable-line func-names
  const paths = [];

  function getThemePath(themeName) {
    const theme = config.themes[themeName];

    paths.push(config.projectPath + theme.src);

    if(theme.parent) {
      getThemePath(theme.parent);
    }
  }

  getThemePath(themeName);

  return paths;
};
