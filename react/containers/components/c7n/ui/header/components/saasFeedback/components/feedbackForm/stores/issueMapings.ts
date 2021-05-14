const issueMapping = new Map([
  [
    'advisory',
    {
      name: '问题咨询',
      value: 'advisory',
      mdTextDefault: '<p>【相关路径】：&nbsp;</p><p>【组件/服务/产品版本】：&nbsp;</p><p>【问题描述】：</p>',
    },
  ],
  [
    'defect',
    {
      name: '缺陷提报',
      value: 'defect',
      mdTextDefault: '<p>【相关路径】：&nbsp;</p><p>【组件/服务/产品版本】：&nbsp;</p><p>【复现路径】：</p><p>【当前结果】：</p><p>【期望结果】：</p>',
    },
  ],
  [
    'demand',
    {
      name: '需求提报',
      value: 'demand',
      mdTextDefault: '<p>【相关路径】：&nbsp;</p><p>【组件/服务/产品当前版本】：&nbsp;</p><p>【需求描述】：</p><p>【需求场景】：</p><p>【实现效果及要求】：</p>',
    },
  ],
]);

export default issueMapping;
