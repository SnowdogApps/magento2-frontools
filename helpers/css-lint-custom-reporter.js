module.exports = function(gulp, plugins, configs) {
  function customReporter(file) {
    plugins.util.log(plugins.util.colors.cyan(file.csslint.errorCount)
    + ' errors in ' + plugins.util.colors.magenta(file.path));

    file.csslint.results.forEach(function(result) {
      if (result.error.type === 'warning') {
        plugins.util.log(plugins.util.colors.yellow.bold('[Warining]')
        + plugins.util.colors.green(' Line: ' + result.error.line)
        + plugins.util.colors.cyan(' Column: ' + result.error.col) + ' '
        + plugins.util.colors.magenta(result.error.message) + ' '
        + plugins.util.colors.gray(result.error.rule.desc) + ' '
        + plugins.util.colors.red('Browsers: ' + result.error.rule.browsers));
      }
      else {
        plugins.util.log(plugins.util.colors.red.bold('[' + result.error.type + ']')
        + plugins.util.colors.green(' Line: ' + result.error.line)
        + plugins.util.colors.cyan(' Column: ' + result.error.col) + ' '
        + plugins.util.colors.magenta(result.error.message) + ' '
        + plugins.util.colors.gray(result.error.rule.desc) + ' '
        + plugins.util.colors.red('Browsers: ' + result.error.rule.browsers));
      }
    });
  }
};
