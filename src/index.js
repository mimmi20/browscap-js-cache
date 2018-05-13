/**
 * Copyright (c) 1998-2015 Browser Capabilities Project
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * @category   browscap-js
 * @package    cache
 * @copyright  1998-2015 Browser Capabilities Project
 * @license    http://www.opensource.org/licenses/MIT MIT License
 * @link       https://github.com/mimmi20/browscap-js/
 */

'use strict';

const CacheClass = require('./cache-class');
const fs = require('fs');

/**
 * a cache proxy to be able to use the cache adapters provided by the WurflCache package
 *
 * @category   browscap-js
 * @package    cache
 * @author     Thomas Müller <t_mueller_stolzenhain@yahoo.de>
 * @copyright  Copyright (c) 1998-2015 Browser Capabilities Project
 * @license    http://www.opensource.org/licenses/MIT MIT License
 * @link       https://github.com/mimmi20/browscap-js/
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
    const data = {content: content};

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
