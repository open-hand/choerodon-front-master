import { DataSet } from 'choerodon-ui/pro';
import { getSearchFieldsConfig } from '../../AllProjects/config/querybarConfig';
import { getOrganizationId } from '@/utils/getId';
import { organizationsApiConfig } from '@/apis';
import transformResponseTreeData from '@/utils/transformResponseTreeData';

const contrastMapToQueryDsMap = new Map([ // 列表返回字段code 和 项目列表搜索条 ds 不一样
  ['creator', 'createdBys'],
  ['type', 'categoryIds'],
  ['classify', 'projectClassficationIds'],
  ['workGroup', 'workGroupIds'],
]);

const contrastMapToFormDsMap = new Map([ // 后端返回字段code 和 创建修改表单 ds 不一样
  ['creator', 'createUserName'],
  ['type', 'categories'], // 项目类型
  ['classify', 'projectClassficationId'],
  ['workGroup', 'workGroupId'],
]);

const getSystemFieldDsProps = (code:any) => {
  // TODO 这里引用也导致请求了
  const configs = getSearchFieldsConfig(getOrganizationId(), true);
  const customQueryBarFieldCode = contrastMapToQueryDsMap.get(code)!;
  const found = configs.find((item:any) => item.dsProps.name === customQueryBarFieldCode);
  if (found!.dsProps.name === 'workGroupIds') {
    return { // 不含未分配
      ...found!.dsProps,
      options: new DataSet({
        autoCreate: true,
        autoQuery: true,
        idField: 'id',
        parentField: 'parentId',
        transport: {
          read: ({ data }) => ({
            method: 'get',
            url: organizationsApiConfig.getprojWorkGroup('', true).url,
            transformResponse: (res) => transformResponseTreeData(res, 'workGroupVOS'),
          }),
        },
      }),
    };
  }
  if (found!.dsProps.name === 'projectClassficationIds') {
    return {
      ...found!.dsProps,
      options: new DataSet({
        autoCreate: true,
        autoQuery: true,
        idField: 'id',
        parentField: 'parentId',
        transport: {
          read: ({ data }) => ({
            method: 'post',
            url: organizationsApiConfig.getprojClassification('').url,
            transformResponse: (res) => transformResponseTreeData(res, 'treeProjectClassfication'),
          }),
        },
      }),
    };
  }
  return {
    ...found!.dsProps,
  };
};

export { contrastMapToQueryDsMap, getSystemFieldDsProps, contrastMapToFormDsMap };
