# Magento 2 Forntools
Set of front-end tools for Magento 2 based on Gulp.js

## Currently working well, standalone tasks
* `deploy` - Process themes styles
  * `--theme name` - Process single theme styles
* `clean` - Removes `/pub/static` folder

## Tasks working well, but depending on other task data
* `less` - Compiles LESS files of given theme
* `sass` - Compile  SASS files of given theme

## Tasks "to do" list
1. `assets` - Probably just wrapper to `bin/magento setup:static-content:deploy` - I create "lighter" version of this tool, without styles processing, and works fast enough.
2. `watch` - Watch for changes and run files processing
3. `browser-sync` - Run BrowserSync - it's much better and easier to use than "LiveReload"
4. `eslint` - Watch and run eslint on specified JS file
 * `--file fileName` - You have to specify what file you want lint
5. `css-lint` - Lining CSS files
  * `--full` - Prints full CSSLint output (without any config)
6. `scripts` - Lint and build JS files
7. `uglify` - Uglify JS files
