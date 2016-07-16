'use strict';
module.exports = function (plugins) {
  return function (message) {
    return plugins.util.colors.red('\n' + '='.repeat(message.length) + ' \n')
      + plugins.util.colors.yellow(message)
      + plugins.util.colors.red('\n' + '='.repeat(message.length))
  }
};