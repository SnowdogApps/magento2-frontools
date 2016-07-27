'use strict';
module.exports = function() { // eslint-disable-line func-names
  // Open browser-sync session and start watchers
  this.opts.plugins.runSequence('browser-sync', 'watch');
};
