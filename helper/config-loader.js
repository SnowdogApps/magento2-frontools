'use strict';
module.exports = function(file, plugins, config, failOnError) { // eslint-disable-line func-names
  if (typeof failOnError === 'undefined') {
    failOnError = true;
  }

  // Check if file exists inside of config directory
  if (plugins.globby.sync(config.projectPath + 'dev/tools/frontools/configs/' + file).length) {
    return require(config.projectPath + 'dev/tools/frontools/configs/' + file);
  }
  else if (plugins.globby.sync('./config/' + file).length) {
    return require('../config/' + file);
  }
  else {
    if (failOnError) {
      throw new plugins.util.PluginError({
        'plugin' : 'config',
        'message': plugins.errorMessage('You have to create ' + file)
      })
    }

    return {};
  }
};
