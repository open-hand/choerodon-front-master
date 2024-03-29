// eslint-disable-next-line import/no-cycle

class RouteAxios {
  pendingRequest: Map<any, any>;

  constructor() {
    this.pendingRequest = new Map();
  }

  get size() {
    return this.pendingRequest.size;
  }

  get(key:string) {
    return this.pendingRequest.get(key);
  }

  delete(key:string) {
    this.pendingRequest.delete(key);
  }

  has(key:string) {
    return this.pendingRequest.has(key);
  }

  set(key:string, value:any) {
    this.pendingRequest.set(key, value);
  }

  isEmpty() {
    return !!this.pendingRequest.size;
  }

  clear() {
    this.pendingRequest = new Map();
  }

  cancelAllRequest() {
    for (const [key, value] of this.pendingRequest) {
      if (value?.cancel && typeof value.cancel === 'function') {
        value.cancel();
      }
    }
    this.clear();
  }
}

export default RouteAxios;
