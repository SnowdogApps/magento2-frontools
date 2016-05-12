# Magento 2 Frontools
Set of front-end tools for Magento 2, based on Gulp.js

---

## Requirements
* `node >= 4.0.0` - heavily recommend using current LTS (v4 branch), not a latest version.
* Gulp CLI global package- `npm install gulp-cli -g`
* Magento 2 project and composer :)

## How to start?
* Run `composer require snowdog/frontools`
* Go to package directory (probably `vendor/snowdog/frontools`) and run `npm install`
* If you are lazy... I know you are :) Run `gulp symlink` this will create symlink to this dir in project root.
* Go to project root and then `cd tools`
* Use one of tasks listed bellow

---

## Tasks list
* `browser-sync` - Run BrowserSync - it's much better and easier to use than "LiveReload"
* `clean` - Removes `/pub/static` folder
* `default` - type `gulp` to see this readme in console
* `deploy` - Wrapper for `bin/magento dev:source-theme:deploy` - only for default themes
  * `--theme name` - Deploy single theme
* `dev` - Runs `browser-sync` and `watch` tasks
  * `--theme name` - Process single theme
  * `--maps` - Toggles source maps generation
  * `--prod` - Production output - minifies styles
* `styles` - Use it to manually trigger styles processing pipeline
  * `--theme name` - Process single theme
  * `--maps` - Toggles source maps generation
  * `--prod` - Production output - minifies styles
* `eslint` - Watch and run eslint on specified JS file
 * `--file fileName` - You have to specify what file you want to lint
* `release` - Clean `pub/static`, deploy all necessary files and compiles everything with `--prod` flag. Makes code production ready.
* `watch` - Watch for styles changes and run processing task
  * `--theme name` - Process single theme
  * `--maps` - Toggles source maps generation
  * `--prod` - Production output - minifies styles

---

## `config/themes.json` structure
- `src` - full path to theme
- `dest` - full path to `pub/static/[theme]`
- `locale` - array of available locales
- `lang` - define styles lang want to use for processing i.e. `less` or `scss`. Should be same as files extension.
- `default` - (optional) if your theme use default PHP based processing via `bin/magento dev:source-theme:deploy` set this to `true`.
- `area`, `vendor`, `name` - (optional) self-descriptive, only for `default` themes
- `files` - (optional) Array of LESS files to process
- `postcss` - (optional) PostCSS plugins config. This have to be an array.

---

## Tasks "to do" list
1. `assets` - Probably just wrapper to `bin/magento setup:static-content:deploy` - I create "lighter" version of this tool, without styles processing, and works fast enough for production deployment purposes.
2. `css-lint` - Lining CSS files
  * `--full` - Prints full CSSLint output (without any config)
3. `scripts` - Lint and build JS files
4. `uglify` - Uglify JS files
5. `requirejs` - I have no idea how processing of JS in M2 works, but I'm pretty sure that some automation will be needed :)
