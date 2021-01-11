import sprintNotDone from '../img/1.png';
import sprintCount from '../img/2.png';
import burnDownChart from '../img/3.png';
import defectTreatment from '../img/4.png';
import defectChart from '../img/5.png';
import appService from '../img/6.png';
import env from '../img/7.png';
import pipelineChart from '../img/8.png';
import commitChart from '../img/9.png';
import deployChart from '../img/10.png';
import onlineMember from '../img/11.png';

const componentsObj = {
  // 冲刺未完成统计
  sprintNotDone: {
    layout: {
      x: 8,
      y: 0,
      w: 4,
      h: 2,
      minH: 2,
      minW: 4,
      static: true,
      i: 'sprintNotDone',
    },
    name: 'sprintNotDone',
    type: 'sprintNotDone',
    groupId: 'jobManage',
    title: '冲刺未完成统计',
    describe: '展示当前迭代我待办的问题项，以便高效完成工作计划。',
    img: sprintNotDone,
  },
  // 迭代问题统计
  sprintCount: {
    layout: {
      x: 8,
      y: 2,
      h: 1,
      w: 4,
      minH: 1,
      minW: 4,
      static: true,
      i: 'sprintCount',
    },
    name: 'sprintCount',
    type: 'sprintCount',
    groupId: 'jobManage',
    title: '迭代问题统计',
    describe: '展示我关注的特性、问题项、需求，以便我能快速了解关注的工作内容和进展情况。',
    img: sprintCount,
  },
  // 燃尽图
  burnDownChart: {
    layout: {
      x: 0,
      y: 1,
      h: 4,
      w: 8,
      minH: 3,
      minW: 4,
      static: true,
      i: 'burnDownChart',
    },
    name: 'burnDownChart',
    type: 'burnDownChart',
    groupId: 'jobManage',
    title: '燃尽图',
    describe: '展示当前迭代我提交的和待我修复的缺陷，以便我能及时处理风险漏洞。',
    img: burnDownChart,
  },
  // 缺陷提出与解决
  defectTreatment: {
    layout: {
      x: 0,
      y: 5,
      h: 4,
      w: 8,
      minH: 3,
      minW: 4,
      static: true,
      i: 'defectTreatment',
    },
    name: 'defectTreatment',
    type: 'defectTreatment',
    groupId: 'jobManage',
    title: '缺陷提出与解决',
    describe: '此模块将会显示待我审核的“流水线人工卡点任务”与“代码合并请求”。',
    img: defectTreatment,
  },
  // 缺陷累计趋势图
  defectChart: {
    layout: {
      x: 0,
      y: 9,
      h: 4,
      w: 7,
      minH: 3,
      minW: 4,
      static: true,
      i: 'defectChart',
    },
    name: 'defectChart',
    type: 'defectChart',
    groupId: 'jobManage',
    title: '缺陷累计趋势图',
    describe: '此模块将显示我近7天操作过的应用服务，以便我能从工作台快速进入对应的代码仓库。',
    img: defectChart,
  },
  // 应用服务
  appService: {
    layout: {
      x: 0,
      y: 0,
      h: 1,
      w: 4,
      minH: 1,
      minW: 4,
      static: true,
      i: 'appService',
    },
    name: 'appService',
    type: 'appService',
    groupId: 'devops',
    title: '应用服务',
    describe: '此模块将显示我近7天使用过的环境，以便我能从工作台快速进入对应的环境管理资源。',
    img: appService,
  },
  // 环境
  env: {
    layout: {
      x: 4,
      y: 0,
      h: 1,
      w: 4,
      minH: 1,
      minW: 4,
      static: true,
      i: 'env',
    },
    name: 'env',
    type: 'env',
    groupId: 'devops',
    title: '环境',
    describe: '此模块将显示我所在项目共享的网址链接，同时支持创建个人的网址链接；以便从工作台快速进入目标地址。',
    img: env,
  },

  // 流水线触发次数
  pipelineChart: {
    layout: {
      x: 7,
      y: 9,
      h: 4,
      w: 5,
      minH: 3,
      minW: 4,
      static: true,
      i: 'pipelineChart',
    },
    name: 'pipelineChart',
    type: 'pipelineChart',
    groupId: 'devops',
    title: '流水线触发次数',
    describe: '此模块将显示我所在项目更新的知识库文档动态，同时支持筛选出我操作过的文档。',
    img: pipelineChart,
  },
  // 迭代代码提交次数
  commitChart: {
    layout: {
      x: 0,
      y: 6,
      h: 5,
      w: 4,
      minH: 3,
      minW: 3,
      maxH: 7,
      static: true,
      i: 'commitChart',
    },
    name: 'commitChart',
    type: 'commitChart',
    groupId: 'devops',
    title: '迭代代码提交次数',
    describe: '此模块将显示我近7天使用过的环境，以便我能从工作台快速进入对应的环境管理资源。',
    img: commitChart,
  },
  // 迭代部署次数
  deployChart: {
    layout: {
      x: 4,
      y: 6,
      h: 5,
      w: 5,
      minH: 4,
      minW: 4,
      static: true,
      i: 'deployChart',
    },
    name: 'deployChart',
    type: 'deployChart',
    groupId: 'devops',
    title: '迭代部署次数',
    describe: '此模块将显示我所在项目共享的网址链接，同时支持创建个人的网址链接；以便从工作台快速进入目标地址。',
    img: deployChart,
  },

  // 在线成员
  onlineMember: {
    layout: {
      x: 9,
      y: 7,
      h: 5,
      w: 3,
      minH: 2,
      minW: 3,
      static: true,
      i: 'onlineMember',
    },
    name: 'onlineMember',
    type: 'onlineMember',
    groupId: 'common',
    title: '在线成员',
    describe: '此模块将显示我所在项目更新的知识库文档动态，同时支持筛选出我操作过的文档。',
    img: onlineMember,
  },
};

export default componentsObj;
