'use strict';
module.exports = (file, plugins, config, failOnError = true) => {
  const externalPath = config.projectPath + 'dev/tools/frontools/config/' + file;

  // Check if file exists inside the config directory
  if (plugins.globby.sync(externalPath).length) {
    if (file.includes('yml')) {
      return plugins.yaml.safeLoad(plugins.fs.readFileSync(externalPath));
    }
    else {
      return JSON.parse(plugins.fs.readFileSync(externalPath));
    }
  }

  if (plugins.globby.sync('config/' + file).length) {
    if (file.includes('yml')) {
      return plugins.yaml.safeLoad(plugins.fs.readFileSync('config/' + file));
    }
    else {
      return JSON.parse(plugins.fs.readFileSync('config/' + file));
    }
  }

  if (failOnError) {
    throw new plugins.util.PluginError({
      'plugin' : 'config',
      'message': plugins.errorMessage('You have to create ' + file)
    })
  }

  return {}
};
