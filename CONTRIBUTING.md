# Contributing

Thank You for interest in contribution!
It is very nice, than You want to help.

There are two ways, that You can help:

1. **Create issues** - this is very important, because this way I and community can track problems and solutions.
  If you don't know how to code, that's how You can help us!
2. **Apply code changes** - either You are experienced developer or beginner, You can always count on my help,
  if You want to help with a code directly. Open source is a great way to learn working in group, learn some coding practices and so on,
  and I'm eager to help everybody. If you cannot solve some problem, just reference me in the issue or send me an e-mail on soanvig@gmail.com.

## Toolchain

. | .
--|--
Typing | TypeScript
Build tool | Rollup
Test tool | Ava

## Installation

After cloning the repository run:

```
yarn install
```

Then You can run *watch* mode, so Rollup rebuilds the code on each change

```
yarn watch
```

Now You can open `index.html` file, and test changes there.

## Pull Requests, open source, LGPL philosophy

You are obligated by LGPL license to make your changes to the library public,
**even if you are making these changes for private project** (see [#License explanation](./README.md#license-explanation)).

To do so you should:

1. Fork the repository as new public repository
2. Apply changes to Your repository
3. (optionally) Create Pull Request to original repository if Your changes may be useful to others
4. (optionally) You may add yourself to contributors here

It would be very nice if Your changes are covered by some reasonable unit tests.

## Creating new modules

As JSR is almost entirely modular, it is easy to add new modules! As described in [architecture.drawio](./architecture.drawio)
JSR uses two types of plugins: *extensions* and *modules*. As for now, user cannot add custom *extensions* via API, but can add custom *modules*.

Modules are classes, that implements `Module` interface, and their responsibility is to render state - usually by applying HTML changes.
They can apply event listeners, and publish changes back to state.

See some modules that already are in application for inspiration, how to write them. This is really simple API.

After creating a module it can be added to JSR init configuration, and everything should launch.

## v1 contributors

Thanks to all contributors, which made v1 better version:

- [johnnyflinn](https://github.com/johnnyflinn) - setValue hotfix, ES5 build
- [Nufeen](https://github.com/Nufeen) - README revision
- [plumthedev](https://github.com/plumthedev) - fixed rounding number in grid display
- [sahithyen](https://github.com/sahithyen) - support for HDPI (grid)
- [Soanvig](https://github.com/soanvig) - maintainer (in sake of consistency :-) )

Besides that thanks to all people who tried to contribute by opening issues and PRs!