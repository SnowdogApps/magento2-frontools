'use strict';
module.exports = function(file, plugins, config) {
  // Check if file exists inside of config directory
  if (plugins.globby.sync(config.projectPath + 'dev/tools/frontools/configs/' + file).length) {
    return require(config.projectPath + 'dev/tools/frontools/configs/' + file);
  }
  else if (plugins.globby.sync('./config/' + file).length) {
    return require('../config/' + file);
  }
  else {
    return {};
  }
};
