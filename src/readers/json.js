export default {
  extension: 'json'
, read: function(str, path) {
    return JSON.parse(str);
  }
};
