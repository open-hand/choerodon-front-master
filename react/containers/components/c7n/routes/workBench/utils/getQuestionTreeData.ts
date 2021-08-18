import {
  groupBy, filter, forEach, isEmpty, uniqBy,
} from 'lodash';
import { TreeItemProps } from '../components/question-tree';

// 用于待办事项、缺陷、我报告的等敏捷问题树结构数据转换
// 由平铺的一维数组[issueData]转为按项目id分组且父子数据嵌套的对象{ projectId: issueData }

/**
 * 用于待办事项、缺陷、我报告的等敏捷问题树结构数据转换
 * 由平铺的一维数组[issueData]转为按项目id分组且父子数据嵌套的对象{ projectId: issueData }
 * @param data 一维数组
 * @param hasParent 是否有父任务
 */

const getQuestionTreeData = (data: TreeItemProps[] = [], hasParent: boolean = true, idField: string = 'issueId') => {
  if (isEmpty(data)) {
    return {};
  }
  const newData = uniqBy(data, idField);
  if (!hasParent) {
    return groupBy(newData, 'projectId');
  }
  const childrenData = groupBy(newData, 'parentId');
  const parentData = filter(newData, (item) => !item.parentId);
  forEach(parentData, (item) => {
    // @ts-ignore
    if (item && childrenData && childrenData[item[idField]]) {
      // @ts-ignore
      // eslint-disable-next-line no-param-reassign
      item.children = childrenData[item[idField]];
    }
  });
  return groupBy(parentData, 'projectId');
};

export default getQuestionTreeData;
