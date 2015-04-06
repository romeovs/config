import fs   from 'fs'
import path from 'path'
import find from 'findup'

// gets the correct reader for a given
// path.
var findReader = function(readers = [], pth) {
  var ext = path.extname(pth).slice(1);
  for ( var reader of readers ) {
    if ( reader.extension === ext ) {
      return reader;
    }
  }
};

// get name from path
var pathname = function(pth) {
  return path.basename(pth, path.extname(pth));
};

// reads all the files in
// the base path
var readAll = function(base, readers, ignore = false, defaults = {}) {
  var files = fs.readdirSync(base);

  var config =
    files.reduce(function(prev, filename) {
      var name = pathname(filename);

      if ( prev[name] ) {
        throw new Error(
          `duplicate config with name '${name}', files: '${prev[name]._file}' and '${filename}'`);
      }

      var reader = findReader(readers, filename);
      if ( !reader ) {
        if ( !ignore ) {
          throw new Error(`no valid config reader for file ${filename}`);
        } else {
          // no reader found, ignore
          return prev;
        }
      }

      // read file contents
      var str = fs.readFileSync(path.join(base, filename)).toString();

      // add config, taking defaults into consideration
      prev[name] = Object.assign(defaults[name] || {}, reader.read(str));
      return prev;

    }, {});

  return config;
};

// import default readers
import yaml from './readers/yaml'
import js   from './readers/js'
import json from './readers/json'

var defreaders = [
  yaml
, js
, json
];

var config = function(opts = {}) {
  opts.ignore   = opts.ignore !== false;       // ignore missing readers
  opts.defaults = opts.defaults || {};         // fallback config object
  opts.readers  = opts.readers || defreaders;  // which readers to use

  // get correct config dir
  var base;
  if ( opts.absolute && opts.base ) {
    throw new Error(`cannot have both opts.base and opts.absolute`);
  } else if ( opts.absolute ) {
    base = opts.absolute;
  } else {
    var packdir = find.sync('.', 'package.json');
    base = path.join(packdir, opts.base || 'config');
  }

  // read config
  var read = readAll(base, opts.readers, opts.ignore, opts.defaults);

  return Object.assign(opts.defaults, read);
};

// attach default readers
config.readers = {
  yaml
, js
, json
};

export default config;
