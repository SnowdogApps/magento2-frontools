'use strict';
module.exports = function(gulp, plugins, config, name, file) { // eslint-disable-line func-names
  const dest            = [],
        production      = plugins.util.env.prod || false,
        theme           = config.themes[name],
        srcBase         = config.projectPath + theme.dest;

  let emailFilename   = 'email-inline.css';

  if (production) {
    emailFilename = 'email-inline.min.css';
  }

  return gulp.src(file || srcBase + '/**/*/' + emailFilename)
    .pipe(plugins.if(
      !plugins.util.env.ci,
      plugins.plumber({
        errorHandler: plugins.notify.onError('Error: <%= error.message %>')
      })
    ))
    .pipe(plugins.logger({
      display   : 'rel',
      beforeEach: 'Email styles from: ',
      afterEach : ' has been fixed!'
    }))
    .pipe(plugins.replace('@charset "UTF-8";',''))
    .pipe(plugins.multiDest(dest))
};

