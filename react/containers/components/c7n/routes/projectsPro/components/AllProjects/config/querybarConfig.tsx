import React from 'react';
import Record from 'choerodon-ui/pro/lib/data-set/Record';
import { UserInfo } from '@choerodon/components';
import { DataSet } from 'choerodon-ui/pro';
import { organizationsApiConfig, iamApiConfig } from '@/apis';
import transformResponseTreeData from '@/utils/transformResponseTreeData';

const userOptionRender = ({ record }: { record: Record }) => (
  <UserInfo
    className="c7ncd-waterfall-deliverables-table-search-line-userinfo"
    loginName={record?.get('ldap') ? record?.get('loginName') : record?.get('email')}
    realName={record?.get('realName')}
    avatar={record?.get('imageUrl')}
  />
);

const nodeCover = ({ record }: {record:Record}) => ({
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

export const getSearchFieldsConfig = (orgId:string, hasBusiness:boolean) => {
  const searchFieldsConfig = [
    {
      type: 'FlatSelect',
      initial: true,
      placeholder: '项目状态',
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
      },
    },
    {
      type: 'FlatTreeSelect',
      initial: true,
      placeholder: '工作组',
      dsProps: {
        name: 'workGroupIds',
        ...defaultDsConfig,
        optionRenderer: ({ text }:{text:string}) => <span className="tree-select-text">{text}</span>,
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
      },
    },
    {
      type: 'FlatTreeSelect',
      initial: true,
      placeholder: '项目分类',
      dsProps: {
        name: 'projectClassficationIds',
        ...defaultDsConfig,
        onOption: nodeCover,
        optionRenderer: ({ text }:{text:string}) => <span className="tree-select-text">{text}</span>,
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
      },
    },
    {
      type: 'FlatSelect',
      initial: true,
      placeholder: '所属项目群',
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
      },
    },
    {
      type: 'FlatSelect',
      initial: true,
      placeholder: '项目类型',
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
      },
    },
    {
      type: 'FlatSelect',
      initial: false,
      placeholder: '创建人',
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
      },
    },
    {
      type: 'DateTimePicker',
      initial: false,
      placeholder: ['创建时间从', '至'],
      dsProps: {
        name: 'createTime',
        range: true,
      },
    },
    {
      type: 'FlatSelect',
      initial: false,
      placeholder: '更新人',
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
      },
    },
    {
      type: 'DateTimePicker',
      initial: false,
      placeholder: ['更新时间从', '至'],
      dsProps: {
        name: 'updateTime',
        range: true,
      },
    },
  ];
  const searchBusinessFieldsConfig = [...searchFieldsConfig, {
    type: 'FlatSelect',
    initial: true,
    placeholder: '健康状态',
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
    },
  },
  ];
  return hasBusiness ? searchBusinessFieldsConfig : searchFieldsConfig;
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
