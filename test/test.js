import chai   from 'chai'
import config from '../src'
import path   from 'path'
import Lab    from 'lab'

const expect = chai.expect;

var lab      = Lab.script();
var describe = lab.describe;
var it       = lab.it;
export { lab };

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
  it('should read the config properly', function(done) {
    var c = config();
    expect(c).to
      .deep.equal(expected);
    done();
  });

  it('should take default config', function(done) {
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
    done();
  });

  it('should allow for absolute paths to be specified', function(done) {
    var c = config({
      absolute: path.join(__dirname, 'alt')
    });

    expect(c).to
      .have.property('yaml')
      .that.has.property('alt')
      .that.equals(true);
    done();
  });

  it('should allow for relative paths to be specified', function(done) {
    var c = config({
      base: path.join('test', 'alt')
    });

    expect(c).to
      .have.property('yaml')
      .that.has.property('alt')
      .that.equals(true);
    done();
  });

  it('should throw when duplicate config is present', function(done) {
    expect(function() {
      var c = config({
        base: 'wrong'
      });
    }).to.throw(/duplicate/);
    done();
  });

  it('should throw when no reader is found and ignore is false', function(done) {
    expect(function() {
      var c = config({
        ignore: false
      , readers: []
      });
    }).to.throw(/config reader/);
    done();
  });

  it('should not throw when no reader is found and ignore is true', function(done) {
    expect(function() {
      var c = config({
        ignore: true
      , readers: []
      });
    }).to.not.throw(/config reader/);
    done();
  });

  it('should throw when `base` and `absolute` are both set', function(done) {
    expect(function() {
      var c = config({
        base: 'foo'
      , absolute: 'bar'
      });
    }).to.throw(/cannot have/);
    done();
  });

  it('should merge the defaults in a sane way', function(done) {
    var c = config({
      defaults: {
        yaml: { def: true }
      }
    });

    expect(c.yaml).to
      .have.property('def')
        .that.equals(true)

    expect(c.yaml).to
      .have.property('yaml')
        .that.equals(true)

    expect(c.yaml).to
      .have.property('js')
        .that.equals(false)

    expect(c.yaml).to
      .have.property('json')
        .that.equals(false)
    done();
  });
});
