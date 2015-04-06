export default {
  extension: 'js'
, read: function(str, path) {
    var Module = module.constructor;
    var m = new Module();
    m._compile(str, path);
    return m.exports;
  }
};
