type CacheKey = string
type Callback = (data: any) => void
// eslint-disable-next-line no-shadow
enum STATUS {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed'
}
interface Task {
  request: () => Promise<any>,
  cacheKey: CacheKey,
  callback: Callback
}
interface ICached {
  status: STATUS
  callbacks: Callback[]
  data?: any
}
class Cache {
  private queue: Task[] = [];

  private cached: Map<CacheKey, ICached> = new Map();

  async request() {
    const task = this.queue.pop();
    if (!task) {
      return;
    }
    const { request, cacheKey, callback } = task;
    this.cached.set(cacheKey, {
      status: STATUS.PENDING,
      callbacks: [callback],
    });
    try {
      const res = await request();
      const cached = this.cached.get(cacheKey);
      if (cached) {
        cached.status = STATUS.SUCCESS;
        cached.data = res;
        this.flushCallback(cacheKey);
      }
    } catch (error) {
      // 失败时删除
      this.cached.delete(cacheKey);
    }
  }

  flushCallback(cacheKey: CacheKey) {
    const cached = this.cached.get(cacheKey);
    if (cached) {
      const { callbacks, data } = cached;
      callbacks.forEach((callback) => {
        callback(data);
      });
    }
  }

  registerCallback(cacheKey: CacheKey, callback: Callback) {
    const cached = this.cached.get(cacheKey);
    if (cached) {
      cached.callbacks.push(callback);
    }
  }

  apply(newTask: Task) {
    const { request, cacheKey, callback } = newTask;
    if (this.cached.has(cacheKey)) {
      const cached = this.cached.get(cacheKey);
      if (cached && cached.status === STATUS.SUCCESS) {
        callback(cached.data);
      } else {
        this.registerCallback(cacheKey, callback);
      }
    } else {
      this.queue.push({
        request,
        cacheKey,
        callback,
      });
      this.request();
    }
  }

  get(cacheKey: CacheKey) {
    const cached = this.cached.get(cacheKey);
    if (cached && cached.status === STATUS.SUCCESS) {
      return cached.data;
    }
    return undefined;
  }
}
const globalCache = new Cache();

export default globalCache;
