// @ts-ignore
import { toJS } from 'mobx';
import { merge, omit } from 'lodash';
import CacheBaseStore from './CacheBaseStore';

class LocalPageCacheStore {
  pages = new Map<string, any>();

  pageKeys = new Map<string, Set<string>>();

  setItem(pageKey: string, data: any, that: CacheBaseStore<any>) {
    this.pageKeys.get(that.projectId)?.add(pageKey) || this.pageKeys.set(that.projectId, new Set([pageKey]));
    this.pages.set(`${that.projectId}-${pageKey}`, data);
  }

  mergeSetItem(pageKey: string, data: any, that: CacheBaseStore<any>) {
    this.pageKeys.get(that.projectId)?.add(pageKey) || this.pageKeys.set(that.projectId, new Set([pageKey]));
    const oldData = this.pages.get(`${that.projectId}-${pageKey}`);
    const omitKeys = [];
    if (typeof (oldData) === 'object' && typeof (data) === 'object') {
      for (const [key, value] of Object.entries(data)) {
        if (typeof (value) === 'undefined' || (Array.isArray(toJS(value)) && (value as any).length === 0)) {
          omitKeys.push(key);
        }
      }
    }
    const newData = merge(omit(oldData, omitKeys), data);
    this.pages.set(`${that.projectId}-${pageKey}`, newData);
  }

  getItem(pageKey: string, that: CacheBaseStore<any>) {
    return this.pages.get(`${that.projectId}-${pageKey}`);
  }

  removeItem(pageKey: string, that: CacheBaseStore<any>) {
    this.pageKeys.get(that.projectId)?.delete(pageKey);
    this.pages.delete(`${that.projectId}-${pageKey}`);
  }

  has(pageKey: string | RegExp, that: CacheBaseStore<any>) {
    const { projectId } = that;
    if (typeof (pageKey) === 'string' && this.pages.has(`${projectId}-${pageKey}`)) {
      return true;
    }
    if (Object.prototype.toString.call(pageKey) === '[object RegExp]' && !!this.pageKeys.get(that.projectId)?.size) {
      const pageKeyList = Array.from(this.pageKeys.get(that.projectId)!);
      return pageKeyList.some((key) => (pageKey as RegExp).test(key));
    }
    return false;
  }

  clear = () => {
    this.pages.clear();
    this.pageKeys.clear();
  }
}
interface CacheBaseStoreExtension extends CacheBaseStore<string> {
  mergeSetItem: (code: string, data: any) => void
  has: (pageKey: string | RegExp) => boolean
  cacheStore: LocalPageCacheStore
}
const testLocalPageCacheStore = new CacheBaseStore<string>(new LocalPageCacheStore(), { openProjectPrefix: false }) as CacheBaseStoreExtension;

export { testLocalPageCacheStore as localPageCacheStore };
