/* eslint-disable import/no-anonymous-default-export */
export default (() => ({
  autoCreate: true,
  fields: [
    {
      label: '问题类型',
      required: true,
      name: 'issueType',
    },
    {
      label: '紧急程度',
      required: true,
      name: 'emergency',
    },
    {
      label: '问题标题',
      required: true,
      name: 'title',
    },
  ],
}));
