export default ({ }: {}): object => ({
  autoCreate: true,
  fields: [
    {
      name: 'userEmail',
      label: '邮箱',
    },
    {
      name: 'password',
      label: '密码',
      required: true,
    },
    {
      name: 'userToken',
    },
  ],
});
