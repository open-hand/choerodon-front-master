import React from 'react';
import Record from 'choerodon-ui/pro/lib/data-set/Record';
import { UserInfo } from '@choerodon/components';
import { DataSet } from 'choerodon-ui/pro';
import { organizationsApiConfig, iamApiConfig } from '@/apis';
import transformResponseTreeData from '@/utils/transformResponseTreeData';
import { ISearchFields } from '../customQuerybar';

const userOptionRender = ({ record }: { record: Record }) => (
  <UserInfo
    className="c7ncd-waterfall-deliverables-table-search-line-userinfo"
    loginName={record?.get('ldap') ? record?.get('loginName') : record?.get('email')}
    realName={record?.get('realName')}
    avatar={record?.get('imageUrl')}
  />
);

const nodeCover = ({ record }: { record: Record }) => ({
  disabled: record?.get('hasChildren') || record?.get('children'),
});

const defaultDsConfig = {
  textField: 'name',
  valueField: 'id',
};

const defaultOptionConfig = {
  autoCreate: true,
  autoQuery: true,
};

const defaultSelectEleConfig = {
  searchable: true,
  multiple: true,
  optionTooltip: 'overflow',
  dropdownMatchSelectWidth: false,
  maxTagCount: 3,
};

export const getSearchFieldsConfig = (orgId: string, hasBusiness: boolean) => {
  const searchFieldsConfig: ISearchFields[] = [
    {
      type: 'FlatSelect',
      initial: true,
      dsProps: {
        name: 'statusIds',
        ...defaultDsConfig,
        options: new DataSet({
          ...defaultOptionConfig,
          transport: {
            read({ dataSet, record, params: { page } }) {
              return {
                ...organizationsApiConfig.cooperationProjStatusList(orgId),
              };
            },
          },
        }),
      },
      eleProps: {
        ...defaultSelectEleConfig,
        placeholder: '项目状态',
      },
    },
    {
      type: 'FlatTreeSelect',
      initial: true,
      dsProps: {
        name: 'workGroupIds',
        ...defaultDsConfig,
        optionRenderer: ({ text }: { text: string }) => <span className="tree-select-text">{text}</span>,
        options: new DataSet({
          ...defaultOptionConfig,
          idField: 'id',
          parentField: 'parentId',
          transport: {
            read({ dataSet, record, params: { page } }) {
              return {
                ...organizationsApiConfig.getprojWorkGroup(orgId),
                transformResponse: (res: any) => transformResponseTreeData(res, 'workGroupVOS'),
              };
            },
          },
        }),
      },
      eleProps: {
        ...defaultSelectEleConfig,
        placeholder: '工作组',
      },
    },
    {
      type: 'FlatTreeSelect',
      initial: true,
      dsProps: {
        name: 'projectClassficationIds',
        ...defaultDsConfig,
        onOption: nodeCover,
        optionRenderer: ({ text }: { text: string }) => <span className="tree-select-text">{text}</span>,
        options: new DataSet({
          ...defaultOptionConfig,
          idField: 'id',
          parentField: 'parentId',
          transport: {
            read({ dataSet, record, params: { page } }) {
              return {
                ...organizationsApiConfig.getprojClassification(orgId, true),
                transformResponse: (res: any) => transformResponseTreeData(res, 'treeProjectClassfication'),
              };
            },
          },
        }),
      },
      eleProps: {
        ...defaultSelectEleConfig,
        placeholder: '项目分类',
      },
    },
    {
      type: 'FlatSelect',
      initial: true,
      dsProps: {
        name: 'programIds',
        ...defaultDsConfig,
        options: new DataSet({
          ...defaultOptionConfig,
          transport: {
            read({ dataSet, record, params: { page } }) {
              return {
                ...organizationsApiConfig.getprojPrograms(orgId),
              };
            },
          },
        }),
      },
      eleProps: {
        ...defaultSelectEleConfig,
        placeholder: '所属项目群',
      },
    },
    {
      type: 'FlatSelect',
      initial: true,
      dsProps: {
        name: 'categoryIds',
        ...defaultDsConfig,
        options: new DataSet({
          ...defaultOptionConfig,
          transport: {
            read({ dataSet, record, params: { page } }) {
              return {
                ...organizationsApiConfig.getprojType(orgId),
              };
            },
          },
        }),
      },
      eleProps: {
        ...defaultSelectEleConfig,
        placeholder: '项目类型',
      },
    },
    {
      type: 'FlatSelect',
      initial: false,
      dsProps: {
        name: 'createdBys',
        textField: 'realName',
        valueField: 'id',
        options: new DataSet({
          ...defaultOptionConfig,
          transport: {
            read({ dataSet, record, params: { page } }) {
              return {
                ...organizationsApiConfig.getprojUsers(orgId),
              };
            },
          },
        }),
      },
      eleProps: {
        ...defaultSelectEleConfig,
        optionRenderer: userOptionRender,
        searchMatcher: 'params',
        placeholder: '创建人',
      },
    },
    {
      type: 'DateTimePicker',
      initial: false,
      dsProps: {
        name: 'createTime',
        range: true,
        isFlat: true,
      },
      eleProps: {
        isFlat: true,
        placeholder: ['创建时间从', '至'],
      },
    },
    {
      type: 'FlatSelect',
      initial: false,
      dsProps: {
        name: 'lastUpdatedBys',
        textField: 'realName',
        valueField: 'id',
        options: new DataSet({
          ...defaultOptionConfig,
          transport: {
            read({ dataSet, record, params: { page } }) {
              return {
                ...organizationsApiConfig.getprojUsers(orgId),
              };
            },
          },
        }),
      },
      eleProps: {
        ...defaultSelectEleConfig,
        optionRenderer: userOptionRender,
        searchMatcher: 'params',
        placeholder: '更新人',
      },
    },
    {
      type: 'DateTimePicker',
      initial: false,
      dsProps: {
        name: 'updateTime',
        range: true,
      },
      eleProps: {
        isFlat: true,
        placeholder: ['更新时间从', '至'],
      },
    },
  ];

  const searchBusinessFieldsConfigObj: ISearchFields = {
    type: 'FlatSelect',
    initial: true,
    dsProps: {
      name: 'healthSateIds',
      ...defaultDsConfig,
      options: new DataSet({
        ...defaultOptionConfig,
        paging: false,
        transport: {
          read({ dataSet, record, params: { page } }) {
            return {
              ...iamApiConfig.getHealthStates(orgId),
            };
          },
        },
      }),
    },
    eleProps: {
      ...defaultSelectEleConfig,
      placeholder: '健康状态',
    },
  };

  if (!hasBusiness) {
    searchFieldsConfig.splice(5, 0, searchBusinessFieldsConfigObj);
  }

  return searchFieldsConfig;
};

export const getFilterFieldsConfig = () => [
  {
    name: 'createdBys',
    label: '创建人',
  },
  {
    name: 'createTime',
    label: '创建时间',
  },
  {
    name: 'lastUpdatedBys',
    label: '更新人',
  },
  {
    name: 'updateTime',
    label: '更新时间',
  },
];
