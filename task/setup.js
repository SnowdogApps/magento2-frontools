'use strict';
module.exports = function() { // eslint-disable-line func-names
  // Global variables
  const plugins              = this.opts.plugins,
        config               = this.opts.config,
        path                 = require('path'),

        // Create a relative symlink in project root to /vendor/snowdog/frontools
        relativeDirectory    = path.relative(config.projectPath, plugins.fs.realpathSync('./')),
        symlinkDirectoryName = plugins.util.env.symlink || 'tools',

        // Set config files paths
        configSamplesPath    = './config/',
        configPath           = config.projectPath + 'dev/tools/frontools/config/';

  try {
    plugins.fs.symlinkSync(relativeDirectory, config.projectPath + '/' + symlinkDirectoryName, 'dir');

    plugins.util.log(
      plugins.util.colors.green('Symlink created. You can now use Frontools from the "' + symlinkDirectoryName + '" directory.')
    );
  }
  catch (error) {
    plugins.util.log(
      plugins.util.colors.yellow(symlinkDirectoryName + ' already exists. Skipped it.')
    );
  }

  // Copy all all non existent config files to /dev/tools/frontools/config/
  plugins.fs.readdirSync(configSamplesPath).forEach((fileName) => {
    const newFileName = fileName.replace('.sample', '');

    try {
      plugins.fs.copySync(configSamplesPath + fileName, configPath + newFileName, {
        clobber: false
      });

      plugins.util.log('File ' + fileName + ' copied to /dev/tools/frontools/config/' + newFileName);
    }
    catch (error) {
      plugins.util.log(
        plugins.util.colors.yellow('File ' + newFileName + ' already exists. Skipped it.')
      );
    }
  });

  plugins.util.log(
    plugins.util.colors.green('Setup complete! Go to "/dev/tools/frontools/config/" directory and edit the configuration there.')
  );
};
