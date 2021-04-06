import todoThings from '../img/todoThings.png';
import todoQuestions from '../img/todoQuestions.svg';
import myStar from '../img/myStar.png';
import myDefect from '../img/myDefect.png';
import serviceList from '../img/appServiceLists.png';
import doc from '../img/doc.png';
import quickLink from '../img/quickLink.png';
import env from '../img/envLists.png';
import selfInfo from '../img/selfInfo.svg';
import selfCode from '../img/selfCode.svg';
import myExecution from '../img/myExecution.png';

const componentsObj = {
  // 星标项目
  starTarget: {
    layout: {
      x: 0,
      y: 0,
      w: 9,
      h: 2,
      minH: 2,
      minW: 9,
      i: 'starTarget',
      static: true,
    },
    name: 'starTarget',
    type: 'starTarget',
    groupId: 'common',
  },
  // 用户信息
  selfInfo: {
    layout: {
      x: 9,
      y: 0,
      h: 2,
      w: 3,
      minH: 2,
      minW: 2,
      i: 'selfInfo',
    },
    name: 'selfInfo',
    type: 'selfInfo',
    groupId: 'common',
    title: '个人信息',
    describe: '展示我的用户名、邮箱以及日期',
    img: selfInfo,
  },
  // 待办事项
  todoQustions: {
    layout: {
      x: 0,
      y: 2,
      h: 4,
      w: 5,
      minH: 3,
      minW: 4,
      i: 'todoQustions',
    },
    name: 'todoQustions',
    type: 'todoQustions',
    groupId: 'agile',
    title: '待办事项',
    describe: '展示当前迭代我待办的问题项，以便高效完成工作计划。',
    img: todoQuestions,
  },
  // 我的关注
  myStar: {
    layout: {
      h: 4,
      w: 4,
      minH: 4,
      minW: 4,
      i: 'myStar',
      x: 5,
      y: 6,
    },
    name: 'myStar',
    type: 'myStar',
    groupId: 'agile',
    title: '我的关注',
    describe: '展示我关注的特性、问题项、需求，以便我能快速了解关注的工作内容和进展情况。',
    img: myStar,
  },

  backlogApprove: {
    layout: {
      h: 5,
      i: 'backlogApprove',
      minH: 5,
      minW: 9,
      w: 9,
      x: 0,
      y: 18,
    },
    name: 'backlogApprove',
    type: 'backlogApprove',
    groupId: 'backlog',
    title: '需求待审核',
    describe:
      '此模块显示该组织下待您审核的需求列表。',
    img: myExecution,
  },
  // 我的缺陷
  myDefect: {
    layout: {
      x: 0,
      y: 6,
      h: 4,
      w: 5,
      minH: 4,
      minW: 4,
      i: 'myDefect',
    },
    name: 'myDefect',
    type: 'myDefect',
    groupId: 'agile',
    title: '我的缺陷',
    describe: '展示当前迭代我提交的和待我修复的缺陷，以便我能及时处理风险漏洞。',
    img: myDefect,
  },
  // 待审核模块
  todoThings: {
    layout: {
      x: 5,
      y: 2,
      h: 4,
      w: 4,
      minH: 3,
      minW: 4,
      i: 'todoThings',
    },
    name: 'todoThings',
    type: 'todoThings',
    groupId: 'devops',
    title: '待审核',
    describe: '此模块将会显示待我审核的“流水线人工卡点任务”与“代码合并请求”。',
    img: todoThings,
  },

  // 最近使用应用服务
  serviceList: {
    layout: {
      x: 9,
      y: 2,
      h: 5,
      w: 3,
      minH: 2,
      minW: 3,
      maxH: 7,
      i: 'serviceList',
    },
    name: 'serviceList',
    type: 'serviceList',
    groupId: 'devops',
    title: '应用服务（最近使用）',
    describe: '此模块将显示我近7天操作过的应用服务，以便我能从工作台快速进入对应的代码仓库。',
    img: serviceList,
  },
  // 快速链接
  quickLink: {
    layout: {
      x: 0,
      y: 14,
      h: 4,
      w: 4,
      minH: 3,
      minW: 3,
      maxH: 7,
      i: 'quickLink',
    },
    name: 'quickLink',
    type: 'quickLink',
    groupId: 'common',
    title: '快速链接',
    describe: '此模块将显示我所在项目共享的网址链接，同时支持创建个人的网址链接；以便从工作台快速进入目标地址。',
    img: quickLink,
  },
  // 文档
  doc: {
    layout: {
      x: 4,
      y: 14,
      h: 4,
      w: 5,
      minH: 4,
      minW: 4,
      maxH: 8,
      i: 'doc',
    },
    name: 'doc',
    type: 'doc',
    groupId: 'common',
    title: '文档',
    describe: '此模块将显示我所在项目更新的知识库文档动态，同时支持筛选出我操作过的文档。',
    img: doc,
  },

  // 最近使用环境
  envList: {
    layout: {
      x: 9,
      y: 7,
      h: 5,
      w: 3,
      minH: 2,
      minW: 3,
      i: 'envList',
    },
    name: 'envList',
    type: 'envList',
    groupId: 'devops',
    title: '环境（最近使用）',
    describe: '此模块将显示我近7天使用过的环境，以便我能从工作台快速进入对应的环境管理资源。',
    img: env,
  },

  // 最近代码提交记录
  selfCode: {
    layout: {
      x: 9,
      y: 12,
      h: 5,
      w: 3,
      minH: 2,
      minW: 3,
      maxH: 8,
      i: 'selfCode',
    },
    name: 'selfCode',
    type: 'selfCode',
    groupId: 'devops',
    title: '代码提交记录',
    describe: '用于展示我近7天的代码提交记录',
    img: selfCode,
  },
  myReport: {
    layout: {
      x: 0,
      y: 10,
      h: 4,
      w: 5,
      minH: 4,
      minW: 4,
      i: 'myReport',
    },
    name: 'myReport',
    type: 'myReport',
    groupId: 'agile',
    title: '我报告的',
    describe: '展示当前迭代中报告人是我的问题项。',
    img: todoQuestions,
  },
  // 我执行的用例
  myExecution: {
    layout: {
      x: 5,
      y: 10,
      h: 4,
      w: 4,
      minH: 4,
      minW: 4,
      i: 'myExecution',
    },
    name: 'myExecution',
    type: 'myExecution',
    groupId: 'agile',
    title: '我执行的用例',
    describe: '此模块展示当前进行的的测试计划中指派给我的用例。',
    img: myExecution,
  },
  myhandler: {
    layout: {
      x: 0,
      y: 23,
      h: 4,
      w: 5,
      minH: 4,
      minW: 4,
      i: 'myhandler',
    },
    name: 'myhandler',
    type: 'myhandler',
    groupId: 'agile',
    title: '我经手的',
    describe: '展示当前迭代中我经手的问题项。',
    img: todoQuestions,
  },
};

export default componentsObj;
