# Magento 2 Forntools
Set of front-end tools for Magento 2, based on Gulp.js

---

## How to start?
* Use this repository as Magento 2 component via composer or simply copy everything to `[project]/tools`
* You need to have `node >= 4.2.6` - current LTS
* `cd` to theme and then to `/tools`
* Run `npm install`
* Use one of listed bellow task

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

## `configs/themes.json` structure
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
5. `requirejs` - Right now I have no idea how processing of JS i M2 work, but I'm pretty sure that some automation will be needed :)
