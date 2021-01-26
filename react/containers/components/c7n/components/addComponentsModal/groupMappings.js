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
      },
      {
        name: '通用',
        key: 'common',
        opts: getArr('common'),
      },
    ]
  );
};

export default cardsMappings;
