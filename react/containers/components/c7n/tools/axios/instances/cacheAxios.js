class AxiosCache {
  constructor() {
    this.cacheData = {};
  }

  set(key, data) {
    this.cacheData[key] = data;
  }

  has(key) {
    return Object.prototype.hasOwnProperty.call(this.cacheData, key);
  }

  get(key) {
    return this.cacheData[key];
  }

  clear(key) {
    delete this.cacheData[key];
  }

  * [Symbol.iterator]() {
    const propKeys = Object.keys(this);
    for (const propKey of propKeys) {
      yield [propKey, this[propKey]];
    }
  }
}

export default AxiosCache;
