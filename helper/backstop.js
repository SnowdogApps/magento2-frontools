'use strict';
module.exports = function(gulp, plugins, config, name, file) { // eslint-disable-line func-names
    // TODO use config path instead of absolute path
    // TODO refactor into a constant

  return () => {
    const theme          = config.themes[name],
          srcBase        = config.projectPath + 'var/view_preprocessed/frontools' + theme.dest.replace('pub/static', ''),
          backstopConfig = require('../helper/config-loader')('backstop.json', plugins, config);

    if (plugins.util.env.genConfig) {
        console.log("Don't run this, run gulp setup instead [TODO]");
    } else if (plugins.util.env.reference) {
        return plugins.backstopjs('reference', {
          "backstopConfigFilePath": "/Users/claireparker/src/demon-tweeks/dev/tools/frontools/config/backstop.json"
        });
    } else if (plugins.util.env.test) {
        return plugins.backstopjs('test', {
          "backstopConfigFilePath": "/Users/claireparker/src/demon-tweeks/dev/tools/frontools/config/backstop.json"
        });
    } else if (plugins.util.env.approve) {
        return plugins.backstopjs('approve', {
          "backstopConfigFilePath": "/Users/claireparker/src/demon-tweeks/dev/tools/frontools/config/backstop.json"
        });
    } else {
        console.log("Nope");
    }
  }
};
