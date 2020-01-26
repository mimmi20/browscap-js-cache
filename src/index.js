'use strict';

const CacheClass = require('./cache-class');
const fs = require('fs');

/**
 * a cache proxy to be able to use the cache adapters provided by the WurflCache package
 */
class BrowscapCache {
  /**
   * @param {string} datafolder
   */
  constructor(datafolder) {
    this.version = null;
    this.folder = datafolder;
  }

  /**
   * Detected browscap version
   *
   * @return {string}
   */
  getVersion() {
    if (this.version === null) {
      const version = this.getItem('browscap.version', false);

      if (version.content !== null && version.success) {
        this.version = version.content;
      }
    }

    return this.version;
  }

  /**
   * Get an item.
   *
   * @param {string} cacheId
   * @param {boolean} withVersion
   * @return {CacheClass}
   */
  getItem(cacheId, withVersion = true) {
    if (typeof withVersion === 'undefined') {
      withVersion = true;
    }

    if (withVersion) {
      cacheId += '.' + this.getVersion();
    }

    const file = this.getPath(cacheId);
    let data;

    try {
      data = fs.readFileSync(file);
    } catch (e) {
      if (e.code === 'ENOENT' || e.code === 'EPERM') {
        // cache file does not exist
        return new CacheClass(null, false);
      }

      throw e;
    }

    const object = JSON.parse(data);

    if (typeof object === 'undefined') {
      return new CacheClass(null, false);
    }

    if (typeof object.content === 'undefined') {
      return new CacheClass(null, false);
    }

    return new CacheClass(object.content, true);
  }

  /**
   * save the content into an json file
   *
   * @param {string} cacheId
   * @param {*} content
   * @param {boolean} withVersion
   * @return {boolean}
   */
  setItem(cacheId, content, withVersion = true) {
    const data = { content: content };

    if (typeof withVersion === 'undefined') {
      withVersion = true;
    }

    if (withVersion) {
      cacheId += '.' + this.getVersion();
    }

    const file = this.getPath(cacheId);

    // Save and return
    const json = JSON.stringify(data);

    try {
      fs.writeFileSync(file, json);
    } catch (e) {
      return false;
    }

    return true;
  }

  /**
   * Test if an item exists.
   *
   * @param {string} cacheId
   * @param {boolean} withVersion
   * @return {boolean}
   */
  hasItem(cacheId, withVersion = true) {
    if (typeof withVersion === 'undefined') {
      withVersion = true;
    }

    const version = this.getItem(cacheId, withVersion);

    return version.content !== null && version.success;
  }

  /**
   * creates the name of the cache file for an cache key
   *
   * @param {string} keyname
   * @return {string}
   */
  getPath(keyname) {
    return this.folder + '/' + keyname + '.json';
  }
}

module.exports = BrowscapCache;
