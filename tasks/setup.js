'use strict';
module.exports = function () {
  // Global variables
  const plugins = this.opts.plugins,
        config  = this.opts.configs,
        path    = require('path');


  // Create a relative symlink from <magento root>/<symlinkDirectoryName> to <magento root>/vendor/snowdog/frontools
  const relativeDirectory    = path.relative(config.projectPath, plugins.fs.realpathSync('./')),
        symlinkDirectoryName = plugins.util.env.symlink || 'tools';

  try {
    plugins.fs.symlinkSync(relativeDirectory, config.projectPath + '/' + symlinkDirectoryName, 'dir');

    plugins.util.log(
      plugins.util.colors.green('Symlink created. You can now use Frontools from the "<magento root>/' + symlinkDirectoryName + '" directory.')
    );
  }
  catch (error) {
    plugins.util.log(
      plugins.util.colors.yellow('<magento root>/' + symlinkDirectoryName + ' already exists. Skipped it.')
    );
  }

  // Set config files paths
  const configSamplesPath = './config/',
        configPath        = config.projectPath + 'dev/tools/frontools/configs/';

  // Copy all all non existent config files to <magento root>/dev/tools/frontools/configs/
  plugins.fs.readdirSync(configSamplesPath).forEach((fileName) => {
    const newFileName = fileName.replace('.sample', '');

    try {
      plugins.fs.copySync(configSamplesPath + fileName, configPath + newFileName, {
        clobber: false
      });

      plugins.util.log('File ' + fileName + ' copied to <magento root>/dev/tools/frontools/configs/' + newFileName);
    }
    catch (error) {
      plugins.util.log(
        plugins.util.colors.yellow('File ' + newFileName + ' already exists. Skipped it.')
      );
    }
  });

  plugins.util.log(
    plugins.util.colors.green('Setup complete! Go to "<magento root>/dev/tools/frontools/configs/" directory and edit the configuration there.')
  );
};
