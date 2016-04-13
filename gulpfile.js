var gulp    = require('gulp'),
    plugins = require('gulp-load-plugins')({
      pattern: ['*', '!gulp', '!gulp-load-plugins'],
      rename: {
        'browser-sync'   : 'browserSync',
        'marked-terminal': 'markedTerminal'
        'run-sequence'   : 'runSequence'
      }
    }),
    configs = {
      'browserSync': require('./configs/browser-sync.json'),
      'csslint'    : require('./configs/css-lint.json'),
      'eslint'     : require('./configs/eslint.json'),
      'themes'     : require('./configs/themes.json')
    };
    tasks   = require('gulp-task-loader')({
      dir    : 'tasks',
      plugins: plugins,
      configs: configs
    });

plugins.browserSync.create();

// define task for each theme, locale, lang, processing type etc.
// gulp can't run same task in parallel, so we need different names
Object.keys(configs.themes).forEach(name => {
  var theme = configs.themes[name];
  theme.locale.forEach(locale => {
    gulp.task(
      theme.lang + ':' + name + ':' + locale,
      require('./helpers/' + theme.lang)(gulp, plugins, configs, name, locale)
    );
  });
});
