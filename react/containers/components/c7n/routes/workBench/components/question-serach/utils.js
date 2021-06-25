import {
  has, isEmpty, omit, set,
} from 'lodash';

const filedMapSearch = {
  issueType: 'searchVO.advancedSearchArgs.typeCodes',
  status: 'searchVO.advancedSearchArgs.statusId',
  priority: 'searchVO.advancedSearchArgs.priorityId',
  assigneeId: 'searchVO.otherArgs.assigneeId',
  contents: 'searchVO.contents',
  // 需求
  backlogPriority: 'advancedSearchArgs.priorityIds',
  handler: 'advancedSearchArgs.userIds',
  backlogStatus: 'advancedSearchArgs.statusIds',
  backlogContents: 'content',

  // 测试
  summary: 'searchArgs.summary',
  testStatus: 'searchArgs.executionStatusList',
  testPriority: 'searchArgs.priorityId',
  testContents: 'contents',
};
export function transformFieldsToSearch(fields, searchMode = 'agile') {
  if (!fields || !Object.keys(fields).length) {
    return undefined;
  }
  const { contents } = fields;
  const searchObj = searchMode === 'agile' ? { searchVO: {} } : {};
  Object.entries(omit(fields, 'contents')).forEach(([key, value]) => {
    set(searchObj, filedMapSearch[key] || key, value);
  });
  if (isEmpty(contents)) {
    return Object.keys(searchObj).length > 0 ? searchObj : undefined;
  }
  switch (searchMode) {
    case 'backlog':
      set(searchObj, filedMapSearch.backlogContents, contents);
      break;
    case 'test':
      set(searchObj, filedMapSearch.testContents, [contents]);
      break;
    default:
      set(searchObj, filedMapSearch.contents, [contents]);
      break;
  }
  return searchObj;
}
