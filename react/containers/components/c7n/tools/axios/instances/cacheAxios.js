class AxiosCache {
  constructor() {
    this.cacheData = new Map();
  }

  get size() {
    return this.cacheData.size;
  }

  get(key) {
    return this.cacheData.get(key);
  }

  delete(key) {
    this.cacheData.delete(key);
  }

  has(key) {
    return this.cacheData.has(key);
  }

  set(key, value) {
    this.cacheData.set(key, value);
  }

  isEmpty() {
    return !!this.cacheData.size;
  }

  clear() {
    this.cacheData = new Map();
  }
}

export default AxiosCache;
