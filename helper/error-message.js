'use strict';
module.exports = function(plugins) { // eslint-disable-line func-names
  return function(message) { // eslint-disable-line func-names
    const lineLength = message.length > 50 ? 50 : message.length;
    return plugins.util.colors.red('\n' + '='.repeat(lineLength) + ' \n')
      + plugins.util.colors.yellow(message)
      + plugins.util.colors.red('\n' + '='.repeat(lineLength))
  }
};
