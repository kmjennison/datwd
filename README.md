# Dependencies All the Way Down

Easily get a list of all Node subdependencies for your top-level dependencies.

🐢🐢🐢🐢🐢🐢🐢🐢🐢🐢🐢🐢🐢🐢🐢🐢🐢🐢🐢🐢🐢🐢🐢🐢🐢🐢🐢🐢🐢🐢🌀...

## Get Started

Install:

`yarn add --dev datwd` or `npm install --dev datwd`

Make sure the `npm` CLI is available and your dependencies are all installed. Then:

```js
const getDependencies = require('datwd')
const allDeps = getDependencies(['some-package', '@another/package'])

// For example:
// [
//   'some-package',
//   'dep1-for-some-package',
//   'dep2-for-some-package',
//   '@another/package',
//   '@another/supporting-package',
// ]
console.log(allDeps)
```

## Why?

#### For use with `webpack-node-externals`

The primary use case this was built for was to support easier configuration for [`webpack-node-externals`](https://github.com/liady/webpack-node-externals). The `allowList` property in `nodeExternals` will whitelist *top-level* Node dependencies but will ignore subdependencies down the tree (see: [Stack Overflow question](https://stackoverflow.com/q/45763620/1332513), [`webpack-node-externals` issue #72](https://github.com/liady/webpack-node-externals/issues/72)). Consequently, by default, your package might ship with missing subdependencies you depend on.

Rather than manually whitelist dependencies and subdependencies (and sub-subdependencies...), use DATWD:

```js
// webpack.config.js
const nodeExternals = require('webpack-node-externals')
const includeSubdependencies = require('datwd')

module.exports = {
  // ...
  externals: [
    nodeExternals({
      // Will include "cookies" and its dependencies; for example:
      // `['cookies', 'depd', 'keygrip', 'tsscmp']`
      allowlist: includeSubdependencies(['cookies'])
    })
  ]
}
```

#### Use NPM or Yarn

In many cases, you likely don't want to use DATWD. Instead, rely on the dependency tree from `yarn list` or `npm ls`.

#### Other use cases?

If you've found DATWD useful in other situations, please open a discussion to share.
