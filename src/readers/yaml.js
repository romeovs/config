import yaml from 'yamljs'

export default {
  extension: 'yaml'
, read: function(str, path) {
    return yaml.parse(str);
  }
};
