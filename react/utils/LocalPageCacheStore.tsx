import { toJS } from 'mobx';
import { merge, omit } from 'lodash';
import { getProjectId } from '@/utils/getId';
import CacheBaseStore from './CacheBaseStore';

class LocalPageCacheStore {
  pages = new Map<string, any>();

  pageKeys = new Map<string, Set<string>>();

  setItem = (pageKey: string, data: any) => {
    this.pageKeys.get(getProjectId())?.add(pageKey) || this.pageKeys.set(getProjectId(), new Set([pageKey]));
    this.pages.set(`${getProjectId()}-${pageKey}`, data);
  }

  mergeSetItem = (pageKey: string, data: any) => {
    this.pageKeys.get(getProjectId())?.add(pageKey) || this.pageKeys.set(getProjectId(), new Set([pageKey]));
    const oldData = this.pages.get(`${getProjectId()}-${pageKey}`);
    const omitKeys = [];
    if (typeof (oldData) === 'object' && typeof (data) === 'object') {
      for (const [key, value] of Object.entries(data)) {
        if (typeof (value) === 'undefined' || (Array.isArray(toJS(value)) && (value as any).length === 0)) {
          omitKeys.push(key);
        }
      }
    }
    const newData = merge(omit(oldData, omitKeys), data);
    this.pages.set(`${getProjectId()}-${pageKey}`, newData);
  }

  getItem = (pageKey: string) => this.pages.get(`${getProjectId()}-${pageKey}`)

  removeItem = (pageKey: string) => {
    this.pageKeys.get(getProjectId())?.delete(pageKey);
    this.pages.delete(`${getProjectId()}-${pageKey}`);
  }

  has = (pageKey: string | RegExp) => {
    const projectId = getProjectId();
    if (typeof (pageKey) === 'string' && this.pages.has(`${projectId}-${pageKey}`)) {
      return true;
    }
    if (Object.prototype.toString.call(pageKey) === '[object RegExp]' && !!this.pageKeys.get(getProjectId())?.size) {
      const pageKeyList = Array.from(this.pageKeys.get(getProjectId())!);
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
