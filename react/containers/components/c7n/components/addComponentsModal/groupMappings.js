import { filter, get } from 'lodash';

const cardsMappings = (mappings) => {
  const getArr = (type) => {
    let res = [];
    if (mappings) {
      res = filter(mappings, (item) => item.groupId === type);
    }
    return res;
  };

  const groupArr = [
    {
      name: '全部分类',
      key: 'all',
      opts: [...getArr('agile'), ...getArr('devops'), ...getArr('backlog'), ...getArr('common')],
    },
    {
      name: '敏捷管理',
      key: 'agile',
      opts: getArr('agile'),
    },
    {
      name: 'DevOps管理',
      key: 'devops',
      opts: getArr('devops'),
      emptyTitle: '暂无对应项目类型',
      emptyDesc: '该项目未选择【DevOps流程】项目类型，暂不可用',
    },
    {
      name: '通用',
      key: 'common',
      opts: getArr('common'),
      emptyTitle: '暂无对应项目类型',
      emptyDesc: '该项目未选择【敏捷管理】项目类型，暂不可用',
    },
  ];

  if (getArr('backlog')?.length) {
    groupArr.splice(groupArr.length - 1, 0, {
      name: '需求管理',
      key: 'backlog',
      opts: getArr('backlog'),
      emptyTitle: '暂无对应项目类型',
      emptyDesc: '该项目未选择【需求管理】项目类型，暂不可用',
    });
  }
  return groupArr;
};

export default cardsMappings;
