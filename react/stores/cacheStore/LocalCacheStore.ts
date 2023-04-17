import CacheBaseStore from './CacheBaseStore';

export type LocalCacheStoreIssueTypeKeys = 'agile.issue.type.common.selected' | 'agile.issue.type.sub.selected' | 'agile.EditIssue.width'
| 'agile.gantt.table.width' | 'projects.list.selected'
/**
 *  游览器localStore
 */
const localCacheStore = new CacheBaseStore<LocalCacheStoreIssueTypeKeys>(localStorage);
export default localCacheStore;
