# Frontend boilerplate

Support CSS as *SASS* (SCSS syntax), HTML as *Jade* (aka *Pug*) templates.

Support JS with modules (using *Rollup*) transpiled from ES6 to older syntax (using *Babel*), *Uglify*'ied during build and validated by *ESLint* (with my own rules).

## Usage

There are three important directories:

- `src` - where most of your app files go.
- `dist` - where builded app goes (everything from here can be copied directly to webserver).
- `public` - see [Public directory](#public-directory).

### Development

To serve with *browsersync*: `grunt dev`

### Production

To build: `grunt dist`.

### HTML / Jade (Pug)

**HTML is not supported** (use [Pug](https://pugjs.org/api/getting-started.html))

Use `index.pug` as the start point of your application (though any filename **and** number of files are allowed). Every file is compiled into it's HTML equivalent (preserving original name).

All files should be placed in `src/assets/pug`, and have `.pug` extension.

**NOTE**: Any name starting with `_` won't be compiled to appropriate `.html` file (usable esp with layout files).

### CSS / SASS

The main file is `main.scss` file. Other files in `scss` directory are just a proposed architecture.

All files should be placed in `src/assets/scss`, and have `.scss` extension (to keep things uniform).

The decision has been made to use SCSS syntax (not SASS syntax), because SCSS syntax can be used also by people who don't know SASS at all. **If you don't know SASS** just write your CSS in `.scss` files and eventually use [@import directive](http://sass-lang.com/guide) to split CSS into multiple files, just as was done in the repository.

### JS

The main file is `main.js` file.

All files should be placed in `src/assets/js`, and have `.js` extension.

As `main.js` is transpiled by rollup and babel, you can use import/export directives in your JS file.

All .js files are checked by *ESLint*.

#### ESLint

ESLint is runned only during build.

##### Removing from build

Remove `'eslint',` from `grunt.js` from `grunt.registerTask('dist',[...]` line.

##### Adding to development

Add `'eslint',` into `grunt.js` to `grunt.registerTask('dev',` line (just like other properties are added there - preferably in the beginning of array). This will run eslint during starting `grunt dev` task.

Add `'eslint',` into `grunt.js` to `config.watch.js.tasks` array. This will run `eslint` during every JS file change.

### Public directory

Basicaly no file in public is converted in any way. Files from `public` directory are copied directly into `dist` directory during build (preserving the tree structure). Files from here are available for browser during development from *root* address (starting with `/`).

What should be here? Files, that are not neccessary for application/website itself.
They may be i.e. part of the content (images for articles) - though the website background image should go to `src/assets/images`.

You can find `vendor` directory inside `public`. There should go all files from outsourced solutions (plugins or something like that). This is in fact only a proposal from my side.