import { omit, set } from 'lodash';
import { getProjectId } from '@/utils/getId';

export interface CacheStoreInterface {
  getItem: (code: string) => any

  setItem: (code: string, data: any) => void

  removeItem: (code: string) => void

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

  get project() {
    return this.openProjectPrefix ? `${getProjectId()} ` : '';
  }

  constructor(cacheStore: CacheStoreInterface, config?: CacheBaseStoreConfigProps) {
    this.cacheStore = cacheStore;

    this.openProjectPrefix = config?.openProjectPrefix ?? true;
    const otherProps = omit(cacheStore, 'getItem', 'setItem', 'removeItem', 'clear', 'has', 'remove');
    Object.entries(otherProps).forEach(([key, value]) => {
      if (value instanceof Function) {
        set(this, key, (...args:any[]) => this.cacheStore[key](...args));
      }
    });
  }

  getItem = (code: T) => this.cacheStore.getItem(`${this.project}${code}`)

  setItem = (code: T, data: any) => this.cacheStore.setItem(`${this.project}${code}`, data);

  removeItem = (code: T) => this.cacheStore.removeItem(`${this.project}${code}`);

  remove = (code: T) => this.removeItem(`${this.project}${code}` as T);

  has = (code: any) => (typeof (this.cacheStore.has) === 'function' ? this.cacheStore.has(`${this.project}${code}`) : this.getItem(`${this.project}${code}` as T))

  clear = () => this.cacheStore.clear()
}

export default CacheBaseStore;
