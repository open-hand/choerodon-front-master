import { toJS } from 'mobx';
import { merge, omit } from 'lodash';

const pages = new Map();
class LocalPageCacheStore {
  projectId=''

  setProjectId(data) {
    this.projectId = data;
  }

  setItem(pageKey, data) {
    pages.set(`${this.projectId}-${pageKey}`, data);
  }

  mergeSetItem(pageKey, data) {
    const oldData = pages.get(`${this.projectId}-${pageKey}`);
    const omitKeys = [];
    if (typeof (oldData) === 'object' && typeof (data) === 'object') {
      for (const [key, value] of Object.entries(data)) {
        if (typeof (value) === 'undefined' || (Array.isArray(toJS(value)) && value.length === 0)) {
          omitKeys.push(key);
        }
      }
    }
    const newData = merge(omit(oldData, omitKeys), data);
    pages.set(`${this.projectId}-${pageKey}`, newData);
  }

  getItem(pageKey) {
    return pages.get(`${this.projectId}-${pageKey}`);
  }

  remove(pageKey) {
    pages.delete(`${this.projectId}-${pageKey}`);
  }

  clear = () => {
    pages.clear();
  }
}
const testLocalPageCacheStore = new LocalPageCacheStore();
export { testLocalPageCacheStore as localPageCacheStore };
