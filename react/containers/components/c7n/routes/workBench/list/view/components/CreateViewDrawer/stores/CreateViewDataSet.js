import { DataSet } from 'choerodon-ui/pro';

const CreateViewDataSet = () => ({
  autoQuery: false,
  selection: false,
  // autoCreate: true,
  fields: [
    {
      name: 'view',
      label: '创建布局视图',
      type: 'string',
      defaultValue: 'INTERNAL',
      textField: 'meaning',
      valueField: 'value',
      options: new DataSet({
        data: [
          { value: 'INTERNAL', meaning: '官方视图' },
          { value: 'CUSTOM', meaning: '自定义视图' },
        ],
      }),
    },
    {
      name: 'dashboardId',
      label: '选择官方视图',
      type: 'string',
      lookupCode: 'IAM.INTERNAL_DASHBOARD',
      textField: 'dashboardName',
      valueField: 'dashboardId',
      lookupAxiosConfig: () => ({
        url: '/iam/v1/dashboards/internal',
        params: { filterFlag: 1 },
        method: 'get',
        transformResponse: (res) => {
          let result = res;
          try {
            if (JSON.parse(result)) {
              result = JSON.parse(result).content;
            }
          } catch (e) {
            return result;
          }
          return result;
        },
      }),
      dynamicProps: {
        required: ({ record }) => record.get('view') === 'INTERNAL',
        ignore: ({ record }) => (record.get('view') === 'INTERNAL' ? 'never' : 'always'),
      },
    },
    {
      name: 'dashboardName',
      label: '自定义视图名称',
      type: 'string',
      maxLength: 40,
      dynamicProps: {
        required: ({ record }) => record.get('view') !== 'INTERNAL',
        ignore: ({ record }) => (record.get('view') !== 'INTERNAL' ? 'never' : 'always'),
      },
    },
  ],
  events: {
    update: ({ record, name, value }) => {
      if (name === 'view') {
        record.init('dashboardId', undefined);
        record.init('dashboardName', undefined);
      }
    },
  },
  transport: {
    submit: ({ data, dataSet }) => {
      const { view, ...rest } = data[0];
      // const submitData = { ...rest };
      // if (view === 'INTERNAL') {
      //   rest.dashboardName = dataSet.current.getField('dashboardId').getLookupData(view).dashboardName;
      // }
      const url = view === 'INTERNAL' ? 'iam/v1/dashboard-users' : 'iam/v1/dashboards';
      return {
        url,
        data: rest,
        method: 'post',
      };
    },
  },
});

export default CreateViewDataSet;
