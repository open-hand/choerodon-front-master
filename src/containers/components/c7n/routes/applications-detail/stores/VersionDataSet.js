import moment from 'moment';
import axios from '../../../tools/axios';


export default (AppState, history, applicationId, projectId) => {
  const nameValidator = async (value, name, record) => {
    if (!value) {
      return '请输入版本名称。';
    }
    if (value.trim() === '') {
      return '版本名称不能全为空！';
    }
    if (record.status === 'add' || (record.status !== 'add' && value !== record.get('originName'))) {
      try {
        const url = `/base/v1/projects/${projectId}/applications/versions/${applicationId}/check/${value}`;
        const res = await axios({
          method: 'get',
          url,
        });
        if (res === false) {
          return '版本名称已存在。';
        } else if (res && res.failed) {
          return res.message;
        } else {
          return true;
        }
      } catch (err) {
        return '版本名称已存在或版本名称重名校验失败，请稍后再试。';
      }
    }
  };
  return {
    autoQuery: true,
    selection: false,
    paging: false,
    transport: {
      read: {
        url: `/base/v1/projects/${projectId}/applications/versions/${applicationId}`,
        // url: `/base/v1/projects/490/applications/versions/490`,
        method: 'get',
        transformResponse(data) {
          const d = JSON.parse(data);
          d.list.forEach(o => {
            o.originName = o.name;
          });
          return d;
        },
      },
      submit: ({ dataSet }) => ({
        url: `/base/v1/projects/${projectId}/applications/versions/${dataSet.current.get('id')}`,
        method: 'put',
      }),
    },
    fields: [
      { name: 'name', type: 'string', label: '版本名称', required: true, validator: nameValidator },
      { name: 'statusCode', type: 'string', label: '状态' },
      { name: 'startDate', type: 'date', label: '开始日期', max: 'releaseDate', required: true, defaultValue: moment() },
      { name: 'releaseDate', type: 'date', label: '发布日期', min: 'startDate' },
      { name: 'description', type: 'string', label: '描述' },
    ],
  };
};
