'use strict';
module.exports = function (plugins) {
  return function (message) {
    const lineLength = message.length > 50 ? 50 : message.length;
    return plugins.util.colors.red('\n' + '='.repeat(lineLength) + ' \n')
      + plugins.util.colors.yellow(message)
      + plugins.util.colors.red('\n' + '='.repeat(lineLength))
  }
};
