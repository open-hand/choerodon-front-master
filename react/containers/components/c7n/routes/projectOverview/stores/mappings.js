import sprintNotDone from '../img/1.svg';
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
import assigneeChart from '../img/12.png';
import priorityChart from '../img/13.png';
import issueTypeChart from '../img/14.png';
import issueTable from '../img/15.png';
import projectDynamic from '../img/16.svg';
import workLoad from '../img/17.svg';
import personalWorkload from '../img/18.svg';
import requestChartImage from '../img/requestChart.svg';
import overviewCardImage from '../img/overviewCard.svg';
import milestoneCardImage from '../img/milestone.svg';
/**  layout 是默认所有的组件都显示时布局 */
const componentsObj = {
  // 工作项进度
  issueProgress: {
    layout: {
      h: 7,
      i: 'issueProgress',
      minH: 7,
      minW: 10,
      w: 10,
      x: 0,
      y: 0,
    },
    name: 'issueProgress',
    type: 'issueProgress',
    groupId: 'agile',
    injectGroupId: 'agilePro',
    title: '工作项进度统计',
    describe:
      '此模块按问题计数、工时数2种维度统计当前迭代各个团队成员任务总量、完成量和剩余量。',
    img: sprintCount,
  },
  // 冲刺未完成统计
  sprintNotDone: {
    layout: {
      h: 2,
      i: 'sprintNotDone',
      minH: 2,
      minW: 4,
      w: 4,
      x: 8,
      y: 8,
    },
    name: 'sprintNotDone',
    type: 'sprintNotDone',
    groupId: 'agile',
    title: '冲刺未完成统计',
    describe: '此模块统计当前迭代未完成的工作项数量、故事点数量、工时数量，以及当前迭代剩余天数。',
    img: sprintNotDone,
  },
  // 迭代问题统计
  sprintCount: {
    layout: {
      x: 8,
      y: 10,
      h: 2,
      w: 4,
      minH: 2,
      minW: 4,
      i: 'sprintCount',
    },
    name: 'sprintCount',
    type: 'sprintCount',
    groupId: 'agile',
    title: '迭代问题统计',
    describe:
      '此模块展示当前迭代各个工作项在不同状态下的数量。',
    img: sprintCount,
  },
  // 燃尽图
  burnDownChart: {
    layout: {
      x: 0,
      y: 9,
      h: 3,
      w: 6,
      minH: 3,
      minW: 4,
      i: 'burnDownChart',
    },
    name: 'burnDownChart',
    type: 'burnDownChart',
    groupId: 'agile',
    title: '燃尽图',
    describe:
      '此模块以故事点、预估工时、问题计数三种维度，显示当前迭代下问题项的燃尽情况，以预估当前迭达是否能按期完成。',
    img: burnDownChart,
  },
  // 缺陷提出与解决
  defectTreatment: {
    layout: {
      h: 4,
      i: 'defectTreatment',
      minH: 3,
      minW: 4,
      w: 6,
      x: 0,
      y: 12,
    },
    name: 'defectTreatment',
    type: 'defectTreatment',
    groupId: 'agile',
    title: '缺陷提出与解决',
    describe: '此模块显示当前迭代团队成员提出和解决缺陷的数量。',
    img: defectTreatment,
  },
  // 缺陷趋势图
  defectChart: {
    layout: {
      h: 4,
      i: 'defectChart',
      minH: 3,
      minW: 4,
      w: 5,
      x: 0,
      y: 22,
    },
    name: 'defectChart',
    type: 'defectChart',
    groupId: 'agile',
    title: '缺陷趋势图',
    describe:
      '此模块显示当前迭代时间范围内，每天缺陷提出和解决的变化趋势。',
    img: defectChart,
  },
  // 应用服务
  appService: {
    layout: {
      h: 1,
      i: 'appService',
      minH: 1,
      minW: 3,
      w: 3,
      x: 0,
      y: 8,
    },
    name: 'appService',
    type: 'appService',
    groupId: 'devops',
    title: '应用服务',
    describe:
      '此模块显示了本项目下应用服务的状态与数量。',
    img: appService,
  },
  // 环境
  env: {
    layout: {
      h: 1,
      i: 'env',
      minH: 1,
      minW: 3,
      w: 3,
      x: 3,
      y: 8,
    },
    name: 'env',
    type: 'env',
    groupId: 'devops',
    title: '环境',
    describe:
      '此模块显示了本项目下环境的状态与数量。',
    img: env,
  },

  // 流水线触发次数
  pipelineChart: {
    layout: {
      h: 4,
      i: 'pipelineChart',
      minH: 3,
      minW: 4,
      w: 5,
      x: 7,
      y: 26,
    },
    name: 'pipelineChart',
    type: 'pipelineChart',
    groupId: 'devops',
    title: '流水线触发次数',
    describe:
      '此模块显示该项目下当前迭代应用流水线每天的触发情况以及总的触发次数。',
    img: pipelineChart,
  },
  // 待审核合并请求
  requestChart: {
    layout: {
      h: 4,
      i: 'requestChart',
      minH: 3,
      minW: 4,
      w: 5,
      x: 0,
      y: 27,
    },
    name: 'requestChart',
    type: 'requestChart',
    groupId: 'devops',
    title: '待审核合并请求',
    describe:
      '此模块展示了本项目所有应用服务中待审核的合并请求详情。',
    img: requestChartImage,
  },
  assigneeChart: {
    layout: {
      h: 4,
      i: 'assigneeChart',
      minH: 3,
      minW: 4,
      w: 5,
      x: 7,
      y: 27,
    },
    name: 'assigneeChart',
    type: 'assigneeChart',
    groupId: 'agile',
    title: '经办人分布',
    describe:
      '此模块以问题的经办人为维度， 统计冲刺下各个经办人所经办的问题数量与所占百分比。',
    img: assigneeChart,
  },
  issueTypeChart: {
    layout: {
      h: 5,
      i: 'issueTypeChart',
      minH: 3,
      minW: 4,
      w: 10,
      x: 0,
      y: 31,
    },
    name: 'issueTypeChart',
    type: 'issueTypeChart',
    groupId: 'agile',
    title: '迭代问题类型分布',
    describe:
      '此模块按照问题类型统计不同状态类别下的问题数量，可快速分析冲刺下问题分布情况。',
    img: issueTypeChart,
  },
  issueTable: {
    layout: {
      h: 5,
      i: 'issueTable',
      minH: 5,
      minW: 10,
      w: 10,
      x: 0,
      y: 36,
    },
    name: 'issueTable',
    type: 'issueTable',
    groupId: 'agile',
    title: '冲刺详情',
    describe:
      '此模块展示当前迭代中未完成的问题项清单和已完成的问题项清单。',
    img: issueTable,
  },
  // 迭代代码提交次数
  commitChart: {
    layout: {
      h: 4,
      i: 'commitChart',
      minH: 4,
      minW: 4,
      w: 5,
      x: 0,
      y: 22,
    },
    name: 'commitChart',
    type: 'commitChart',
    groupId: 'devops',
    title: '迭代代码提交次数',
    describe:
      '此模块显示该项目下当前迭代每天的代码提交情况以及总的提交次数。',
    img: commitChart,
  },
  // 迭代部署次数
  deployChart: {
    layout: {
      h: 4,
      i: 'deployChart',
      minH: 4,
      minW: 4,
      w: 5,
      x: 7,
      y: 22,
    },
    name: 'deployChart',
    type: 'deployChart',
    groupId: 'devops',
    title: '迭代部署次数',
    describe:
      '此模块显示该项目下当前迭代每天的部署情况以及总的部署次数。',
    img: deployChart,
  },

  // 在线成员
  onlineMember: {
    layout: {
      x: 8,
      y: 9,
      h: 4,
      w: 4,
      minH: 2,
      minW: 4,
      i: 'onlineMember',
    },
    name: 'onlineMember',
    type: 'onlineMember',
    groupId: 'common',
    title: '在线成员',
    describe:
      '此模块显示该项目下所有在线的团队成员。',
    img: onlineMember,
  },
  // 项目动态
  projectDynamic: {
    layout: {
      h: 5,
      i: 'projectDynamic',
      minH: 5,
      minW: 10,
      w: 10,
      x: 0,
      y: 16,
    },
    name: 'projectDynamic',
    type: 'projectDynamic',
    groupId: 'agile',
    title: '项目动态',
    describe:
      '此模块展示此项目下动态列表。',
    img: projectDynamic,
  },
  // 每人每日工作量
  workLoad: {
    layout: {
      h: 6,
      i: 'workLoad',
      minH: 5,
      minW: 10,
      w: 10,
      x: 0,
      y: 21,
    },
    name: 'workLoad',
    type: 'workLoad',
    groupId: 'agile',
    title: '每人每日工作量',
    describe:
      '此模块展示此项目下每人每日工作量。',
    img: workLoad,
  },
  // 项目动态
  personalWorkload: {
    layout: {
      h: 4,
      i: 'personalWorkload',
      minH: 4,
      minW: 4,
      w: 5,
      x: 0,
      y: 41,
    },
    name: 'personalWorkload',
    type: 'personalWorkload',
    groupId: 'agile',
    title: '个人工作量统计',
    describe:
      '此模块按问题计数、工时数2种维度统计当前迭代各个团队成员任务总量、完成量和剩余量。',
    img: personalWorkload,
  },
  priorityChart: {
    layout: {
      h: 4,
      i: 'priorityChart',
      minH: 3,
      minW: 4,
      w: 5,
      x: 7,
      y: 38,
    },
    name: 'priorityChart',
    type: 'priorityChart',
    groupId: 'agile',
    title: '优先级分布',
    describe:
      '此模块以问题的优先级（高、中、低）为维度，统计冲刺下问题已完成和总计数的数量。',
    img: priorityChart,
  },
  // 特性进度统计
  featureProgress: {
    layout: {
      h: 7,
      i: 'featureProgress',
      minH: 7,
      minW: 10,
      w: 10,
      x: 0,
      y: 41,
    },
    name: 'featureProgress',
    type: 'featureProgress',
    groupId: 'agile',
    injectGroupId: 'agilePro',
    title: '特性进度统计',
    describe:
      '此模块按问题计数、工时数2种维度统计当前迭代各个团队成员任务总量、完成量和剩余量。',
    img: sprintCount,
  },
  // 项目总体情况报表
  overviewCard: {
    layout: {
      h: 4,
      i: 'overviewCard',
      minH: 4,
      minW: 10,
      w: 10,
      x: 0,
      y: 50,
    },
    name: 'overviewCard',
    type: 'overviewCard',
    groupId: 'waterfall',
    injectGroupId: 'waterfallPro',
    title: '项目总体情况',
    describe:
      '实时了解项目工作的进度、工时耗费情况、交付物提交情况以及项目下各个阶段的进度。有助于对项目的全局把控，及时消除风险。',
    img: overviewCardImage,
  },
  // 里程碑进度报表
  milestoneCard: {
    layout: {
      h: 2,
      i: 'milestoneCard',
      minH: 2,
      minW: 10,
      w: 10,
      x: 0,
      y: 53,
    },
    name: 'milestoneCard',
    type: 'milestoneCard',
    groupId: 'waterfall',
    injectGroupId: 'waterfallPro',
    title: '里程碑',
    describe:
      '展示项目里程碑及里程碑完成情况。',
    img: milestoneCardImage,
  },
};

export default componentsObj;
