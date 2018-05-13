const assert = require('assert'),
    BrowscapCache = require('../src/index.js'),
    browscapcache = new BrowscapCache('./test/test-cache/');

suite('checking cache version', function () {
  test('cache version is 6009', function () {
    const version = browscapcache.getVersion();

    assert.strictEqual(version, '6009');
  });
  test('cache content is 6009', function () {
    const object = browscapcache.getItem('browscap.version', false);

    assert.strictEqual(object.content, '6009');
    assert.strictEqual(object.success, true);
  });
  test('cache content is null when invalid', function () {
    const object = browscapcache.getItem('invalid key');

    assert.strictEqual(object.content, null);
    assert.strictEqual(object.success, false);
  });
});
