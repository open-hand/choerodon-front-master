import { omit, set } from 'lodash';
import { getProjectId } from '@/utils/getId';

export interface CacheStoreInterface {
  getItem: (code: string, that: CacheBaseStore<any>) => any

  setItem: (code: string, data: any, that: CacheBaseStore<any>) => void

  removeItem: (code: string, that: CacheBaseStore<any>) => void

  mergeSetItem?: (pageKey: string, data: any, that: CacheBaseStore<any>) => void

  clear: () => void

  [propsName: string]: any
}
interface CacheBaseStoreConfigProps {
  openProjectPrefix?: boolean /** 是否启用项目前缀 */
}

/**
 * 缓存store
 */
class CacheBaseStore<T extends string> implements CacheStoreInterface {
  cacheStore: CacheStoreInterface

  openProjectPrefix = true;

  [propsName: string]: any;

  get prefix() {
    return this.openProjectPrefix ? `${this.projectId} ` : '';
  }

  get projectId() {
    return getProjectId();
  }

  overwrite(Property: string, value: any): CacheBaseStore<T> {
    // 以当前this为模板，创建一个新对象
    const temp = Object.create(this);
    // 不直接temp[Property] = value;的原因是，如果这个属性只有getter，会报错
    Object.defineProperty(temp, Property, {
      get() {
        return value;
      },
    });
    // 返回新对象
    return temp;
  }

  project(projectId?: string) {
    if (projectId) {
      return this.overwrite('projectId', projectId);
    }
    return this;
  }

  unPrefix() {
    return this.overwrite('project', '');
  }

  constructor(cacheStore: CacheStoreInterface, config?: CacheBaseStoreConfigProps) {
    this.cacheStore = cacheStore;

    this.openProjectPrefix = config?.openProjectPrefix ?? true;
    const otherProps = omit(cacheStore, 'getItem', 'setItem', 'removeItem', 'clear', 'has', 'remove');
    Object.entries(otherProps).forEach(([key, value]) => {
      if (value instanceof Function) {
        set(this, key, (...args: any[]) => this.cacheStore[key](...args));
      }
    });
  }

  getItem(code: T): any { return this.cacheStore.getItem(`${this.prefix}${code}`, this); }

  setItem(code: T, data: any) { this.cacheStore.setItem(`${this.prefix}${code}`, data, this); }

  removeItem(code: T) { this.cacheStore.removeItem(`${this.prefix}${code}`, this); }

  remove(code: T) { this.removeItem(`${this.prefix}${code}` as T); }

  mergeSetItem(pageKey: string, data: any) {
    this.cacheStore.mergeSetItem && this.cacheStore.mergeSetItem(pageKey, data, this);
  }

  has(code: any) { return (typeof (this.cacheStore.has) === 'function' ? this.cacheStore.has(`${this.prefix}${code}`, this) : this.getItem(`${this.prefix}${code}` as T)); }

  clear() { this.cacheStore.clear(); }
}

export default CacheBaseStore;
