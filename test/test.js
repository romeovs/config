import chai   from 'chai'
import config from '../build'
import path   from 'path'

const expect = chai.expect;

const yaml = {
  yaml: true
, js:   false
, json: false
};

const js = {
  yaml: false
, js:   true
, json: false
};

const json = {
  yaml: false
, js:   false
, json: true
};

const expected = {
  yaml, js, json
};

describe('reading', function() {
  it('should read the config properly', function() {
    var c = config();
    expect(c).to
      .deep.equal(expected);
  });

  it('should take default config', function() {
    var c = config({
      defaults: {
        d: "ok"
      }
    });

    expect(c).to
      .have.property('d')
      .that.equals("ok");

    expect(c).to
      .have.property('yaml')
        .that.deep.equals(yaml);

    expect(c).to
      .have.property('js')
        .that.deep.equals(js);

    expect(c).to
      .have.property('json')
        .that.deep.equals(json);
  });

  it('should allow for absolute paths to be specified', function() {
    var c = config({
      absolute: path.join(__dirname, 'alt')
    });

    expect(c).to
      .have.property('yaml')
      .that.has.property('alt')
      .that.equals(true);
  });

  it('should allow for relative paths to be specified', function() {
    var c = config({
      base: path.join('test', 'alt')
    });

    expect(c).to
      .have.property('yaml')
      .that.has.property('alt')
      .that.equals(true);
  });

  it('should throw when duplicate config is present', function() {
    expect(function() {
      var c = config({
        base: 'wrong'
      });
    }).to.throw(/duplicate/);
  });

  it('should throw when no reader is found and ignore is false', function() {
    expect(function() {
      var c = config({
        ignore: false
      , readers: []
      });
    }).to.throw(/config reader/);
  });

  it('should not throw when no reader is found and ignore is true', function() {
    expect(function() {
      var c = config({
        ignore: true
      , readers: []
      });
    }).to.not.throw(/config reader/);
  });

  it('should throw when `base` and `absolute` are both set', function() {
    expect(function() {
      var c = config({
        base: 'foo'
      , absolute: 'bar'
      });
    }).to.throw(/cannot have/);
  });
});
