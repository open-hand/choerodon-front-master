function handleUpdate({ record, name, value }) {
  if (name === 'refTable') {
    record.set('code', value.code);
    record.set('name', value.name);
    record.set('description', value.description);
  }
}

export default ({ id = 0, intl }) => {
  const name = intl.formatMessage({ id: 'name' });
  const code = intl.formatMessage({ id: 'code' });
  const description = intl.formatMessage({ id: 'description' });
  const urlPrefix = `/lc/v1${id ? `/organizations/${id}` : ''}/model`;
  return {
    autoQuery: false,
    selection: false,
    transport: {
      create: ({ data: [data] }) => ({
        url: data.refTableCode ? `${urlPrefix}/base_on_table` : urlPrefix,
        method: 'post',
        data,
      }),
      update: ({ data: [data] }) => ({
        url: `${urlPrefix}/${data.id}`,
        method: 'put',
        data,
      }),
      read: {
        url: urlPrefix,
        method: 'get',
      },
      destroy: ({ data: [data] }) => ({
        url: `${urlPrefix}/${data.code}/unpublish`,
        method: 'delete',
        data,
      }),
      validate: {
        url: `${urlPrefix}/check`,
        method: 'post',
        transformRequest({ unique: [data] }) {
          return JSON.stringify(data);
        },
        transformResponse(data) {
          return !data;
        },
      },
    },
    fields: [
      { name: 'name', type: 'string', label: '项目名称' },
      { name: 'appName', type: 'string', label: '应用名称', defaultValue: '默认应用名称' },
      { name: 'code', type: 'string', label: '编码' },
      { name: 'category', type: 'string', label: '类型' },
      { name: 'createBy', type: 'string', label: '创建人' },
      { name: 'creationDate', type: 'date', label: '创建时间' },
      // { name: 'code', type: 'string', label: code, required: true, unique: true },
      // { name: 'description', type: 'string', label: description },
      // {
      //   name: 'refTable',
      //   type: 'object',
      //   textField: 'name',
      //   valueField: 'code',
      //   lookupUrl: '/lc/v1/table?size=0&withoutModelFlag=true',
      //   required: true,
      //   ignore: 'always',
      // },
      // { name: 'refTableName', type: 'string', bind: 'refTable.name' },
      // { name: 'refTableCode', type: 'string', bind: 'refTable.code' },
      // { name: 'tenantFlag', type: 'boolean', label: '组织是否可见' },
      // { name: 'publishStatus', type: 'string' },
    ],
    events: {
      update: handleUpdate,
    },
  };
};
