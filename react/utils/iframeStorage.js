// 处理开放平台嵌入iframe后storage报错问题
class BaseStorage {
  constructor() {
    this.valuesMap = new Map();
  }

  getItem(key) {
    const stringKey = String(key);
    if (this.valuesMap.has(key)) {
      return String(this.valuesMap.get(stringKey));
    }
    return null;
  }

  setItem(key, val) {
    this.valuesMap.set(String(key), String(val));
  }

  removeItem(key) {
    this.valuesMap.delete(key);
  }

  clear() {
    this.valuesMap.clear();
  }

  key(i) {
    if (arguments.length === 0) {
      throw new TypeError("Failed to execute 'key' on 'Storage': 1 argument required, but only 0 present."); // this is a TypeError implemented on Chrome, Firefox throws Not enough arguments to Storage.key.
    }
    const arr = Array.from(this.valuesMap.keys());
    return arr[i];
  }

  get length() {
    return this.valuesMap.size;
  }
}
try {
  // eslint-disable-next-line no-unused-expressions
  window.localStorage;
  // eslint-disable-next-line no-unused-expressions
  window.sessionStorage;
} catch (error) {
  Object.defineProperty(window, 'localStorage', {
    get: () => new BaseStorage(),
  });
  Object.defineProperty(window, 'sessionStorage', {
    get: () => new BaseStorage(),
  });
}
