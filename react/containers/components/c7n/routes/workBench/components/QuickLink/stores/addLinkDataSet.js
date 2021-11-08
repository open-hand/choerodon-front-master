/* eslint-disable import/no-anonymous-default-export */

const linkValidate = (value) => {
  if (!value) {
    return '链接必输。';
  }
  // eslint-disable-next-line no-useless-escape
  const reg = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)$/;
  if (!reg.test(value)) {
    return '链接地址必须以http或者https开头。';
  }
  return true;
};

export default (projectIdOptionsDs) => ({
  autoCreate: true,
  fields: [{
    type: 'string',
    name: 'scope',
    defaultValue: 'project',
  }, {
    name: 'size',
    type: 'number',
    defaultValue: 10,
  }, {
    name: 'projectId',
    type: 'object',
    label: '项目',
    textField: 'name',
    valueField: 'id',
    dynamicProps: {
      required: ({ record }) => record.get('scope') === 'project',
    },
    options: projectIdOptionsDs,
  }, {
    name: 'name',
    type: 'string',
    label: '链接名称',
    required: true,
    maxLength: 30,
  }, {
    name: 'linkUrl',
    type: 'string',
    label: '链接地址',
    required: true,
    validator: linkValidate,
  }],
});
