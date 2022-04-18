# Contributing

Thank You for interest in contribution!
It is very nice, than You want to help.

There are two ways, that You can help:

1. **Create issues** - this is very important, because this way I and community can track problems and solutions.
  If you don't know how to code, that's how You can help us!
2. **Apply code changes** - either You are experienced developer or beginner, You can always count on my help,
  if You want to help with a code directly. Open source is a great way to learn working in group, learn some coding practices and so on,
  and I'm eager to help everybody. If you cannot solve some problem, just reference me in the issue or send me an e-mail on soanvig@gmail.com.

## Installation

Yarn is required to work with monorepo architecture.

It uses zero-install, therefore no `yarn install` is needed. Dependencies are stored in repository.

## Development

**Always write strongly-typed code.**

### Toolchain

. | .
--|--
Package manager | Yarn v2+
Typing | TypeScript
Build tool | Rollup
Test tool | Ava


### Non-upgradeable versions

1. `typescript` has to be `4.4.3` - version `4.5` breaks various used packages
2. `ava` has to be `3.15.0` - version `4.x` introduces `chalk@5` which uses Node's subimports, that are [not supported by Yarn PnP](https://github.com/yarnpkg/berry/issues/3843)

### Testing

1. `mm-jsr` provides `yarn test` command to run init tests
2. For manual testing startup `mm-jsr`, `svelte-mm-jsr` and `webpage` with `yarn manual-test` in root of repository

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

Modules are classes, that implements `Module` interface (all methods are optional),
and their responsibility is usually to render state - usually by applying HTML changes.
They can apply event listeners, and publish changes back to state.

Also, they are able to manipulate state with `.update()` method.
Update method is supposed to update state, and return new version of it. This is powerful method for adding custom behavior,
like customized uneven steps (e.g. for logarithmic scale).

See some modules that already are in application for inspiration, how to write them. This is really simple API.

After creating a module it can be added to JSR init configuration, and everything should launch.

See also abstract `Module` [class documentation](https://soanvig.github.io/mm-jsr/api/classes/module.html).

## v1 contributors

Thanks to all contributors, which made v1 better version:

- [johnnyflinn](https://github.com/johnnyflinn) - setValue hotfix, ES5 build
- [Nufeen](https://github.com/Nufeen) - README revision
- [plumthedev](https://github.com/plumthedev) - fixed rounding number in grid display
- [sahithyen](https://github.com/sahithyen) - support for HDPI (grid)
- [Soanvig](https://github.com/soanvig) - maintainer (in sake of consistency :-) )

Besides that thanks to all people who tried to contribute by opening issues and PRs!