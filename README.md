# config

[![Build
Status](https://travis-ci.org/romeovs/config.svg)](https://travis-ci.org/romeovs/config)

[![Coverage
Status](https://coveralls.io/repos/romeovs/config/badge.svg)](https://coveralls.io/r/romeovs/config)


`config` is a small utility that reads config files from
your project directory.

By default it reads files from the `./config` folder, where `.`
stands for the project root (containing the `package.json` file).

For instance if we have these files in `./config`:

```yaml
# ./config/foo.yaml
foo:  true
bar:  false
```

```yaml
# ./config/bar.yaml
foo:  false
bar:  true
```

then we can add this to our project:

```js
import config from 'config'
var c = config();
// c will equal:
// {
//   foo: {
//     foo: true
//   , bar: false
//   }
// , bar: {
//     foo: false
//   , bar: true
//   }
// }
```

By default, `config` reads all the files in the config directory
that have these extensions: `yaml`, `js`, `json`.  It then places
them in the config object with keys that match their filename.
To change which extensions are allowed, take a look at the 
`readers` option.

## Options
You can pass options like this:

```js
var c = config({
  // options
});
```

### `options.readers`
These are the readers that `config` uses to read the files.
It defaults to `[config.yaml, config.js, config.json]`.

A reader should be an object containing two keys: `extension` and `read`.
For example, the default JSON reader looks like this:
```js
{
  extension: 'json'
, read: function(str) {
    return JSON.parse(str);
  }
}
```

### `options.ignore`
By default, `config` encounters a file that does not have a valid
reader for it (it has an extension not present in `options.readers`),
this file is simply ignored.  You can change this behaviour by setting
`options.ignore` to `false`.  `config` will now throw an error when such
a file is encountered.

### `options.defaults`
You can provide an object that contains the default configuration.
`config` will merge the read config with these defaults.

### `options.base`
This is the location of the configuration directory that holds all
the config files, relative to the root directory of the project (the
directory containing `package.json`).  This defaults to `config`.

### `options.absolute`
If you want to set an absolute path to read config from,
use this option.  Note that you cannot set `options.base`
and `options.absolute` at the same time.



