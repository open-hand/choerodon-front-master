import { filter } from 'lodash';

const cardsMappings = (mappings) => [
  {
    name: '全部分类',
    key: 'all',
    opts: filter(mappings, (item) => item.groupId),
  },
  {
    name: '任务管理',
    key: 'jobManage',
    opts: filter(mappings, (item) => item.groupId === 'jobManage'),
  },
  {
    name: 'DevOps管理',
    key: 'devops',
    opts: filter(mappings, (item) => item.groupId === 'devops'),
  },
  {
    name: '通用',
    key: 'common',
    opts: filter(mappings, (item) => item.groupId === 'common'),
  },
];

export default cardsMappings;
