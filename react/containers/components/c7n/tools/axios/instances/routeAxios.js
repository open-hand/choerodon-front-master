// eslint-disable-next-line import/no-cycle
import { axiosCache } from './index';

class RouteAxios {
  constructor() {
    this.pendingRequest = new Map();
  }

  get size() {
    return this.pendingRequest.size;
  }

  get(key) {
    return this.pendingRequest.get(key);
  }

  delete(key) {
    this.pendingRequest.delete(key);
  }

  has(key) {
    return this.pendingRequest.has(key);
  }

  set(key, value) {
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
        axiosCache.delete(key);
      }
    }
    this.clear();
  }
}

export default RouteAxios;
