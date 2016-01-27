module.exports = function(gulp, plugins, configs) {

  gulp.task('dev', 'Development task - watch all files, compile, refresh browser... Do magic.', function() {
    if(!!plugins.util.env.theme) {
      var themeName = plugins.util.env.theme,
          themeConfig = configs.themes[themeName],
          themeDir = '../app/design/' + themeConfig.area + '/' + themeConfig.name;

      themeConfig.files.forEach(function(file) {
        console.log(themeDir + '/web/' + file + '.' + themeConfig.dsl);
        gulp.src(themeDir + '/web/' + file + '.' + themeConfig.dsl)
          .pipe(plugins.logger({ display: 'name' }))
          .pipe(gulp.dest('../pub/static-test/'));
      });
    }
    else {
      plugins.util.log('Please specify witch theme you would like to compile, for example: gulp dev --theme luma');
    }
  }, {
    options: {
      'theme themeName': 'Specify wich theme you would like to work on'
    }
  });
};
