'use strict';
module.exports = function() { // eslint-disable-line func-names
  // Global variables
  const plugins              = this.opts.plugins,
        config               = this.opts.configs,
        path                 = require('path'),

        // Create a relative symlink in project root to /vendor/snowdog/frontools
        relativeDirectory    = path.relative(config.projectPath, plugins.fs.realpathSync('./')),
        symlinkDirectoryName = plugins.util.env.symlink || 'tools',

        // Set config files paths
        configSamplesPath    = './config/',
        configPath           = config.projectPath + 'dev/tools/frontools/config/',
        casperSamplesPath    = './tests/backstop_data/casper_scripts/',
        casperPath           = config.projectPath + 'dev/tests/backstop_data/casper_scripts/';

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

  // Copy Casper scripts over to 'dev/tests/backstop_data/casper_scripts' directory.
  plugins.fs.readdirSync(casperSamplesPath).forEach((fileName) => {

    try {
      plugins.fs.copySync(casperSamplesPath + fileName, casperPath + fileName, {
        clobber: false
      });

      plugins.util.log('File: ' + fileName + ' copied to /dev/tests/backstop_data/casper_scripts/' + fileName);
    }
    catch (error) {
      plugins.util.log(
        plugins.util.colors.yellow('File ' + fileName + ' already exists. Skipped it.')
      );
    }
  });

  plugins.util.log(
    plugins.util.colors.green('Setup complete! Go to "/dev/tools/frontools/config/" directory and edit the configuration there.')
  );
};
