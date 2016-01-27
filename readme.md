# Magento 2 Forntools
## Set of front-end tools for Magento 2 based on Gulp.js
* `browser-sync` - Run BrowserSync
* `clean` - Remove temporaty folder
* `css-lint` - Lint all css files
  * `--full` - Prints full csslint output (without any config)
* `deploy` - Node replacment of `bin/magento setup:static-content:deploy`
* `dev` - Development task - watch all files, compile, refresh browser... Do magic.
  * `--theme themeName` - Specify witch theme you would like to work on
* `eslint` - Watch and run eslint on specified JS file
  * `--file fileName` - You have to specify what file you want to watch and lint (without extension)
* `help` - Display this help text.
* `less` - Compiles LESS files
* `sass` - Compile all SASS files
  * `--maps` - Toggle sourcemaps generation
* `scripts` - Lint and build all JS scripts on the fly
* `uglify` - Uglify all JS files and save in pub/static dir
