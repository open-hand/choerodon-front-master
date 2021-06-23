class RouteAxios {
  constructor() {
    this.pendingRequest = {};
  }

  set(key, data) {
    this.pendingRequest[key] = data;
  }

  has(key) {
    return Object.prototype.hasOwnProperty.call(this.pendingRequest, key);
  }

  get(key) {
    return this.pendingRequest[key];
  }

  clear(key) {
    delete this.pendingRequest[key];
  }

  * [Symbol.iterator]() {
    const propKeys = Object.keys(this);
    for (const propKey of propKeys) {
      yield [propKey, this[propKey]];
    }
  }
}

export default RouteAxios;
