var gulp    = require('gulp');
var plugins = require('gulp-load-plugins')({
      pattern: ['*', '!gulp', '!gulp-load-plugins'],
      rename: {
        'browser-sync': 'browserSync',
        'run-sequence': 'runSequence'
      }
    });
plugins.browserSync.create();
var configs = {
  'themes' : require('./configs/themes.json'),
  'eslint' : require('./configs/eslint.json'),
  'csslint': require('./configs/css-lint.json')
};
var tasks   = require('gulp-task-loader')({
      dir    : 'tasks',
      plugins: plugins,
      configs: configs
    });

// define task for each theme, locale, lang, processing type etc.
// gulp can't run same task in parallel, so we need different names
Object.keys(configs.themes).forEach(name => {
  var theme = configs.themes[name];
  theme.locale.forEach(locale => {
    gulp.task(theme.lang + ':' + name + ':' + locale, require('./helpers/' + theme.lang)(gulp, plugins, configs, name, locale));
  });
});
