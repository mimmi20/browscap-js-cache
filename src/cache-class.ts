/**
 * generic cache class
 */
export default class CacheClass {
  readonly content: string | number | boolean | object | null | string[];
  readonly success: boolean;

  /**
   * @param {*} content
   * @param {boolean} success
   */
  constructor(
    content: string | number | boolean | object | null | string[],
    success = false
  ) {
    this.content = content;
    this.success = success;
  }
}
