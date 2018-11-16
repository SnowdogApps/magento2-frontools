'use strict';
module.exports = function(gulp, plugins, config, name, file) { // eslint-disable-line func-names
  const theme       = config.themes[name],
        srcBase     = config.projectPath + 'var/view_preprocessed/frontools' + theme.dest.replace('pub/static', ''),
        dest        = [],
        srcTheme    = [],
        themeName   = srcBase.split('/frontools/frontend/')[1],
        enableInliner = plugins.util.env.enableInliner || false;

  function adjustDestinationDirectory(file) {
    file.dirname = file.dirname.replace('web/', '');
    return file;
  }

  theme.locale.forEach(locale => {
    dest.push(config.projectPath + theme.dest + '/' + locale);
  });

  srcTheme.push(config.projectPath + theme.src);

  // Return empty stream if no email directory is included
  if (!plugins.fs.existsSync(srcBase + '/email')) {
    return [];
  }

  var Panini = require('panini').Panini;

  var panini = new Panini({
    root: srcBase + '/',
    layouts: srcBase + '/email/layouts/',
    partials: srcBase + '/email/partials/',
    helpers: srcBase + '/email/helpers/'
  });

  panini.loadBuiltinHelpers();

  return gulp.src(
    file || srcBase + '/**/*.email.hbs',
    { base: srcBase }
  )
    .pipe(
      plugins.if(
        !plugins.util.env.ci,
        plugins.plumber({
          errorHandler: plugins.notify.onError('Error: <%= error.message %>')
        })
      )
    )
    .pipe(panini.render())
    .pipe(plugins.if(!enableInliner, plugins.replace('###THEME-NAME###', themeName)))
    .pipe(plugins.inky())
    .pipe(plugins.replace(/(\\?{!!)(\s+)?/g, '{{'))
    .pipe(plugins.replace(/(\s+)?(!!}\\?)/g, '}}'))
    .pipe(plugins.if(enableInliner, plugins.rename(function rename(path) {
      path.basename = path.basename.replace('.email', '.email.tmp');

      return path;
    })))
    .pipe(plugins.if(!enableInliner, plugins.rename(function rename(path) {
      path.basename = path.basename.replace('.email', '');
      path.extname = '.html';

      return path;
    })))
    .pipe(plugins.rename(adjustDestinationDirectory))
    .pipe(plugins.if(enableInliner, plugins.multiDest(srcBase)))
    .pipe(plugins.if(!enableInliner, plugins.multiDest(srcTheme)))
    .pipe(plugins.logger({
      display   : 'name',
      beforeEach: 'Theme: ' + name + ' ',
      afterEach : ' Compiled!'
    }))
    .pipe(plugins.browserSync.stream());
};
