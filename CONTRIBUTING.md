# MM JSR contributing

## Start

MM JSR uses [Yarn](https://yarnpkg.com/) package manager, so make sure You have it installed.

```
npm install -g yarn
```

Then go ahead with

```
git clone https://github.com/mm-jsr/jsr.git
cd jsr
yarn install
```

## Grunt

Because MM JSR uses [Grunt](https://gruntjs.com/getting-started) in build process, so make sure You have it installed.

## Development

```
grunt dev
```
or
```
yarn run dev
```

starts development server with auto-reload. It keeps an eye on linting and returns results to console, so make sure to look at it before build!

## Build

```
grunt dist
```
or
```
yarn run build
```

builds the project to `dist` directory.

## Babel & browser support

MM JSR relies heavily on ECMAScript 2015. If You want to support older browser, which don't support ES6,
go to `Gruntfile.js`, and uncomment three babel's lines under `rollup.dist.plugins` key, then build again.