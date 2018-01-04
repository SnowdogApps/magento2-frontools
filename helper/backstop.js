'use strict';
module.exports = function(gulp, plugins, config, file) { // eslint-disable-line func-names

  return () => {
    const backstopConfig = require('../helper/config-loader')('backstop.json', plugins, config),
          backstopConfigFilePath = config.projectPath + 'dev/tools/frontools/config/backstop.json',
          backstopOptions = {
               "backstopConfigFilePath": backstopConfigFilePath
          };

    if (plugins.util.env.genConfig) {
        console.log("Don't run this, run gulp setup instead [TODO]");
    } else if (plugins.util.env.reference) {
        if (plugins.util.env.filter) {
            backstopOptions.filter = plugins.util.env.filter;
        }
        return plugins.backstopjs('reference', backstopOptions);
    } else if (plugins.util.env.test) {
        if (plugins.util.env.filter) {
            backstopOptions.filter = plugins.util.env.filter;
        }
        return plugins.backstopjs('test', backstopOptions);
    } else if (plugins.util.env.approve) {
        return plugins.backstopjs('approve', backstopOptions);
    } else {
        console.log("Error, run with a flag to specify the required task: --reference, --test or --approve");
        console.log("Or run the --filter flag alongside the --reference or --test flag");
    }
  }
};
