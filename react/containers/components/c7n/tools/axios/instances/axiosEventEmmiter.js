class EventEmitter {
  constructor() {
    this.events = Object.create(null);
  }

  delete(type) {
    delete this.events[type];
  }

  // 订阅
  on(type, handler) {
    (this.events[type] || (this.events[type] = [])).push(handler);
  }

  // 取消订阅
  off(type, handler) {
    if (this.events[type]) {
      // eslint-disable-next-line no-bitwise
      this.events[type].splice(this.events[type].indexOf(handler) >>> 0, 1);
    }
  }

  // 只订阅一次
  once(type, handler) {
    let fired = false;

    function magic(...rest) {
      this.off(type, magic);
      if (!fired) {
        fired = true;
        handler.apply(this, rest);
      }
    }

    this.on(type, magic);
  }

  // 发布
  emit(type, ...rest) {
    const array = this.events[type] || [];
    for (let i = 0; i < array.length; i += 1) {
      const handler = this.events[type][i];
      handler.apply(this, rest);
    }
  }
}

export default EventEmitter;
