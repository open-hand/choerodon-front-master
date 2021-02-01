import { filter, get } from 'lodash';

const cardsMappings = (mappings) => {
  const getArr = (type) => {
    let res = [];
    if (mappings) {
      res = filter(mappings, (item) => item.groupId === type);
    }
    return res;
  };
  return (
    [
      {
        name: '全部分类',
        key: 'all',
        opts: [...getArr('agile'), ...getArr('devops'), ...getArr('common')],
      },
      {
        name: '任务管理',
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
    ]
  );
};

export default cardsMappings;
