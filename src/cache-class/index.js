'use strict';

/**
 * generic cache class
 */
class CacheClass {
  /**
   * @param {*} content
   * @param {boolean} success
   */
  constructor(content, success = false) {
    this.content = content;
    this.success = success;
  }
}

module.exports = CacheClass;
