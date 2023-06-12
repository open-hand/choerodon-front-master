// import { organizationsApiConfig } from '@choerodon/master';

export default ({ }: {}): object => ({
  autoCreate: true,
  selection: false,
  fields: [
    {
      name: 'aa',
      label: '项目',
    },
    {
      name: 'bb',
      label: '代码检查得分',
    },
    {
      name: 'cc',
      label: '安全漏洞得分',
    },
    {
      name: 'dd',
      label: '集群健康检查得分',
    },
    {
      name: 'ee',
      label: '综合得分',
    },
  ],
  data: [
    {
      aa: '项目1',
      bb: '100',
      cc: '100',
      dd: '100',
      ee: '100',
    },
  ],
  transport: {
    // read: {
    //   //   url: organizationsApiConfig.cooperationProjStatusList().url,
    //   url: 'http://172.23.16.154:30094/agile/v1/projects/282911590022897664/waterfall/deliverable/page_by_projectId',
    //   method: 'get',
    // },
  },
});
