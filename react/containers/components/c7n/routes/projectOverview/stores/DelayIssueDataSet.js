const DelayIssueDataSet = ({ projectId, organizationId}) => ({
  autoQuery: false,
  selection: false,
  // transport: {
  //   read: ({ params }) => {
  //     return ({
  //       url: `/agile/v1/projects/${projectId}/backlog/backlog_list`,
  //       method: 'post',
  //     });
  //   },
  // },
  fields: [
    {
      label: '概要',
      name: 'summary',
      type: 'string',
    },

    {
      label: 'delay',
      name: '延期情况',
      type: 'string',
    },
    {
      label: '经办人',
      name: 'assigneeId',
      type: 'string',
    },
    {
      label: '状态',
      name: 'statusVO',
      type: 'object',
    },
    {
      label: '优先级',
      name: 'priorityVO',
      type: 'object',
    }
  ],
  data: [
    {
      summary: '概要1概要1概要1概要1概要1概要1概要1概要1概要1概要1概要1',
      issueNum: 'AG1245',
      issueTypeVO: {
        colour: "#00bfa5",
        description: "故事",
        icon: "agile_story",
        id: "=9JlyTZyZ_1x1gGtdd3YM0w===",
        initialize: true,
        name: "故事",
        objectVersionNumber: 1,
        organizationId: "7",
        stateMachineId: null,
        stateMachineName: null,
        typeCode: "story",
      },
      issueEndDate: '2020-08-01 00:00:00',
      assigneeId: 7631,
      realName: '李文斐',
      loginName: 20615,
      imageUrl: 'https://minio.choerodon.com.cn/iam-service/file_48f666513b6c4640abbdbf34b9cf9bd3_%3F%3Fd46401601152fed0ba0939ef9f5623dc.jpg',
      statusVO: {
        description: "测试中",
        id: "=lBlvogphndkfg7XasX4W_Q===",
        name: "测试中",
        organizationId: "7",
        type: "doing",
      },
      priorityVO: {
        colour: "#3575DF",
        default: true,
        description: "中",
        enable: true,
        id: "=9se5vRSYad2yPX917GhJ6g===",
        name: "中",
        objectVersionNumber: 1,
        organizationId: "7",
      }
    },
    {
      summary: '概要2',
      issueNum: 'AG1245',
      issueTypeVO: {
        colour: "#00bfa5",
        description: "故事",
        icon: "agile_story",
        id: "=9JlyTZyZ_1x1gGtdd3YM0w===",
        initialize: true,
        name: "故事",
        objectVersionNumber: 1,
        organizationId: "7",
        stateMachineId: null,
        stateMachineName: null,
        typeCode: "story",
      },
      issueEndDate: '2020-08-20 00:00:00',
      assigneeId: 7631,
      realName: '李文斐',
      loginName: 20615,
      imageUrl: 'https://minio.choerodon.com.cn/iam-service/file_48f666513b6c4640abbdbf34b9cf9bd3_%3F%3Fd46401601152fed0ba0939ef9f5623dc.jpg',
      statusVO: {
        description: "测试中",
        id: "=lBlvogphndkfg7XasX4W_Q===",
        name: "测试中",
        organizationId: "7",
        type: "doing",
      },
      priorityVO: {
        colour: "#3575DF",
        default: true,
        description: "中",
        enable: true,
        id: "=9se5vRSYad2yPX917GhJ6g===",
        name: "中",
        objectVersionNumber: 1,
        organizationId: "7",
      }
    }
  ]
});

export default DelayIssueDataSet;
