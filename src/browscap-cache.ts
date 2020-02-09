import CacheClass from './cache-class';

/**
 * a cache proxy to be able to use the cache adapters provided by the WurflCache package
 */
export default class BrowscapCache {
  private folder: string;
  private version: string | number | boolean | object | null;

  /**
   * @param {string} datafolder
   */
  constructor(datafolder: string) {
    this.version = null;
    this.folder = datafolder;
  }

  /**
   * Detected browscap version
   *
   * @return {string}
   */
  public getVersion(): string | number | boolean | object | null | string[] {
    if (this.version === null) {
      let version = this.getItem('browscap.version', false);

      if (
        version.success &&
        version.content !== null &&
        typeof version.content === 'string'
      ) {
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
  public getItem(cacheId: string, withVersion = true): CacheClass {
    if (withVersion) {
      cacheId += '.' + this.getVersion();
    }

    let file = this.getPath(cacheId),
      fs = require('fs'),
      data;

    try {
      data = fs.readFileSync(file);
    } catch (e) {
      if (e.code === 'ENOENT' || e.code === 'EPERM') {
        // cache file does not exist
        return new CacheClass(null, false);
      }

      throw e;
    }

    let object = JSON.parse(data);

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
  public setItem(
    cacheId: string,
    content: string | number | boolean | object | null,
    withVersion = true
  ): boolean {
    let data = { content: content };

    if (withVersion) {
      cacheId += '.' + this.getVersion();
    }

    let file = this.getPath(cacheId),
      json = JSON.stringify(data),
      fs = require('fs');

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
  public hasItem(cacheId: string, withVersion = true): boolean {
    let version = this.getItem(cacheId, withVersion);

    return version.content !== null && version.success;
  }

  /**
   * creates the name of the cache file for an cache key
   *
   * @param {string} keyname
   * @return {string}
   */
  getPath(keyname: string): string {
    return this.folder + '/' + keyname + '.json';
  }
}
