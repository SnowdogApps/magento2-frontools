# Magento 2 Forntools
Set of front-end tools for Magento 2, based on Gulp.js

## How to start?
* (optional) Use this repository as Magento 2 component via composer
* You need to have `node.js`
* `cd` to theme and then to `/tools`
* Run `npm install`
* Use one of listed bellow tasks

## Currently working well, standalone tasks
* `default` - type just `gulp` to see this readme in console
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

## `configs/themes.json` structure
- `area`, `vendor`, `name` - self-descriptive :)
- `locale` - array of available locales (yah, tasks iterate trough array and compile all locales by default)
- `package` - (optional) name of composer package if theme is loaded via composer
- `lang` - what lang want to use for styles processing (right now it's only LESS and SASS, but adding any other is simple -> create new file in `tasks` folder with same name as you define in theme config -> put processor of choice inside -> ready)
- `custom` - (optional) if your theme use default PHP based processing via `bin/magento dev:source-theme:deploy' do not use this parameter. If you have fully custom theme and want processing without looking for files anywhere but inside theme dir (all imports are static to be maintained manually) pass here `true`.
