class AxiosCache extends Map {
  constructor() {
    super();
    this.cacheData = new Map();
  }

  isEmpty() {
    return !!this.cacheData.size;
  }

  clear() {
    this.cacheData = new Map();
  }
}

export default AxiosCache;
