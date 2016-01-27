module.exports = function() {
  var exec = require('child_process').exec;

  return exec('rm -rf ../pub/static');
};
