'use strict';
module.exports = function(gulp, plugins, config, name, file) { // eslint-disable-line func-names
  const theme       = config.themes[name],
        srcBase     = config.projectPath + 'var/view_preprocessed/frontools' + theme.dest.replace('pub/static', ''),
        dest        = [],
        srcTheme    = [];

  function adjustDestinationDirectory(file) {
    file.dirname = file.dirname.replace('web/', '');
    return file;
  }

  theme.locale.forEach(locale => {
    dest.push(config.projectPath + theme.dest + '/' + locale);
  });

  const cssFilePath = dest[0] + '/css/email.css', // eslint-disable-line one-var
        css = plugins.fs.existsSync(cssFilePath) ? plugins.fs.readFileSync(cssFilePath).toString() : '',
        mqCss = plugins.fs.existsSync(cssFilePath) ? plugins.siphon(css) : '';

  srcTheme.push(config.projectPath + theme.src);

  // Return empty stream if no email directory is included
  if (!plugins.fs.existsSync(srcBase + '/email')) {
    return [];
  }

  return gulp.src(
    file || srcBase + '/**/*.email.tmp.hbs',
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
    .pipe(plugins.replace(`<link rel="stylesheet" href="/pub/static/frontend/###THEME-NAME###/de_DE/css/email.css">`, '')) // eslint-disable-line quotes
    .pipe(plugins.inlineCss({
      extraCss: css,
      applyStyleTags: false,
      removeStyleTags: true,
      preserveMediaQueries: true,
      removeLinkTags: false
    }))
    .pipe(plugins.replace('<!-- <style> -->', `<style>${mqCss}</style>`))
    .pipe(plugins.htmlmin({
      collapseWhitespace: true,
      minifyCSS: true
    }))
    .pipe(plugins.rename(function rename(path) {
      path.basename = path.basename.replace('.email.tmp', '');
      path.extname = '.html';

      return path;
    }))
    .pipe(plugins.rename(adjustDestinationDirectory))
    .pipe(plugins.multiDest(srcTheme))
    .pipe(plugins.logger({
      display   : 'name',
      beforeEach: 'Theme: ' + name + ' ',
      afterEach : ' Compiled!'
    }))
    .pipe(plugins.browserSync.stream());
};
