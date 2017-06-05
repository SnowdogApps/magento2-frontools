'use strict';
module.exports = function(gulp, plugins, config, name, file) { // eslint-disable-line func-names

  return () => {
    const theme          = config.themes[name],
          srcBase        = config.projectPath + 'var/view_preprocessed/frontools' + theme.dest.replace('pub/static', ''),
          backstopConfig = require('../helper/config-loader')('backstop.json', plugins, config),
          backstopConfigFilePath = config.projectPath + 'dev/tools/frontools/config/backstop.json',
          backstopOptions = {
               "backstopConfigFilePath": backstopConfigFilePath
          };

    if (plugins.util.env.genConfig) {
        console.log("Don't run this, run gulp setup instead [TODO]");
    } else if (plugins.util.env.reference) {
        return plugins.backstopjs('reference', backstopOptions);
    } else if (plugins.util.env.test) {
        return plugins.backstopjs('test', backstopOptions);
    } else if (plugins.util.env.approve) {
        return plugins.backstopjs('approve', backstopOptions);
    } else {
        console.log("Error, run with a flag to specify the required task: --reference, --test or --approve");
    }
  }
};
