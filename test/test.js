const assert = require('assert'),
  BrowscapCache = require('../src/index.js');

suite('checking cache version', function() {
  test('cache version is 6009', function() {
    const browscapcache = new BrowscapCache('./test/test-cache/'),
      version = browscapcache.getVersion();

    assert.strictEqual(version, '6009');
  });

  test('cache content is 6009', function() {
    const browscapcache = new BrowscapCache('./test/test-cache/'),
      object = browscapcache.getItem('browscap.version', false);

    assert.strictEqual(object.content, '6009');
    assert.strictEqual(object.success, true);
  });

  test('cache content is null when invalid', function() {
    const browscapcache = new BrowscapCache('./test/test-cache/'),
      object = browscapcache.getItem('invalid key');

    assert.strictEqual(object.content, null);
    assert.strictEqual(object.success, false);
  });

  test('versioned cache content is null', function() {
    const browscapcache = new BrowscapCache('./test/test-cache/'),
      object = browscapcache.getItem('browscap.version');

    assert.strictEqual(object.content, null);
    assert.strictEqual(object.success, false);
  });

  test('invalid json is null', function() {
    const browscapcache = new BrowscapCache('./test/test-cache/'),
      object = browscapcache.getItem('invalid.json');

    assert.strictEqual(object.content, null);
    assert.strictEqual(object.success, false);
  });

  test('invalid content is null', function() {
    const browscapcache = new BrowscapCache('./test/test-cache/'),
      object = browscapcache.getItem('invalid.content');

    assert.strictEqual(object.content, null);
    assert.strictEqual(object.success, false);
  });

  test('cache content is found', function() {
    const browscapcache = new BrowscapCache('./test/test-cache/'),
      result = browscapcache.hasItem('browscap.version', false);

    assert.strictEqual(result, true);
  });

  test('versioned cache content is not found', function() {
    const browscapcache = new BrowscapCache('./test/test-cache/'),
      result = browscapcache.hasItem('browscap.version');

    assert.strictEqual(result, false);
  });

  test('cache content is written', function() {
    const browscapcache = new BrowscapCache('./test/test-cache/'),
      resultWrite = browscapcache.setItem('browscap.version.x', 0, false),
      resultRead = browscapcache.hasItem('browscap.version', false);

    assert.strictEqual(resultWrite, true);
    assert.strictEqual(resultRead, true);
  });

  test('versioned cache content is written', function() {
    const browscapcache = new BrowscapCache('./test/test-cache/'),
      resultWrite = browscapcache.setItem('browscap.version.x', 0),
      resultRead = browscapcache.hasItem('browscap.version.x', true);

    assert.strictEqual(resultWrite, true);
    assert.strictEqual(resultRead, true);
  });
});
