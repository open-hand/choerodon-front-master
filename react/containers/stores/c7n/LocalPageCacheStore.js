import { toJS } from 'mobx';
import { merge, omit } from 'lodash';

const pages = new Map();
// 工作台不使用项目id作为前缀区分
class LocalPageCacheStore {
  localData = pages

  projectId = ''

  setProjectId(data) {
    this.projectId = data;
  }

  setItem(pageKey, data, keyPrefix = `${this.projectId}-`) {
    pages.set(`${keyPrefix}${pageKey}`, data);
  }

  mergeSetItem(pageKey, data, keyPrefix = `${this.projectId}-`) {
    const oldData = pages.get(`${keyPrefix}${pageKey}`);
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

  getItem(pageKey, keyPrefix = `${this.projectId}-`) {
    return pages.get(`${keyPrefix}${pageKey}`);
  }

  remove(pageKey, keyPrefix = `${this.projectId}-`) {
    pages.delete(`${keyPrefix}${pageKey}`);
  }

  clear = () => {
    pages.clear();
  }
}
const testLocalPageCacheStore = new LocalPageCacheStore();
export { testLocalPageCacheStore as localPageCacheStore };
