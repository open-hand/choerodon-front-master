import React from 'react';
import Record from 'choerodon-ui/pro/lib/data-set/Record';
import { UserInfo } from '@choerodon/components';
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

export const getSearchFieldsConfig = (orgId:string) => [
  {
    name: 'statusIds',
    type: 'FlatSelect',
    fieldProps: {
      placeholder: '项目状态',
      optionTooltip: 'overflow',
      multiple: true,
      dropdownMatchSelectWidth: false,
      maxTagCount: 3,
      searchable: true,
      flat: true,
      isFlat: true,
    },
    initial: true,
    optionQueryConfig: organizationsApiConfig.cooperationProjStatusList(orgId),
  },
  {
    name: 'workGroupIds',
    type: 'FlatTreeSelect',
    optionsTextField: 'name',
    optionsValueField: 'id',
    fieldProps: {
      placeholder: '工作组',
      optionTooltip: 'overflow',
      multiple: true,
      dropdownMatchSelectWidth: false,
      maxTagCount: 3,
      searchable: true,
      optionRenderer: ({ text }:{text:string}) => <span className="tree-select-text">{text}</span>,
    },
    initial: true,
    optionQueryConfig: {
      ...organizationsApiConfig.getprojWorkGroup(orgId),
      transformResponse: (res: any) => transformResponseTreeData(res, 'workGroupVOS'),
    },
    optionConfig: {
      idField: 'id',
      parentField: 'parentId',
    },
  },
  {
    name: 'projectClassficationIds',
    type: 'FlatTreeSelect',
    optionsTextField: 'name',
    optionsValueField: 'id',
    fieldProps: {
      placeholder: '项目分类',
      optionTooltip: 'overflow',
      multiple: true,
      dropdownMatchSelectWidth: false,
      maxTagCount: 3,
      searchable: true,
      onOption: nodeCover,
      optionRenderer: ({ text }:{text:string}) => <span className="tree-select-text">{text}</span>,
    },
    initial: true,
    optionQueryConfig: {
      ...organizationsApiConfig.getprojClassification(orgId, true),
      transformResponse: (res: any) => transformResponseTreeData(res, 'treeProjectClassfication'),
    },
    optionConfig: {
      idField: 'id',
      parentField: 'parentId',
    },
  },
  {
    name: 'programIds',
    type: 'FlatSelect',
    fieldProps: {
      placeholder: '所属项目群',
      optionTooltip: 'overflow',
      multiple: true,
      dropdownMatchSelectWidth: false,
      maxTagCount: 3,
      searchable: true,
    },
    initial: true,
    optionQueryConfig: organizationsApiConfig.getprojPrograms(orgId),
  },
  {
    name: 'categoryIds',
    type: 'FlatSelect',
    fieldProps: {
      placeholder: '项目类型',
      optionTooltip: 'overflow',
      multiple: true,
      dropdownMatchSelectWidth: false,
      maxTagCount: 3,
      searchable: true,
    },
    initial: true,
    optionQueryConfig: organizationsApiConfig.getprojType(orgId),
  },
];
export const searchFieldsConfig = [
  {
    name: 'statusIds',
    type: 'FlatSelect',
    fieldProps: {
      placeholder: '项目状态',
      optionTooltip: 'overflow',
      multiple: true,
      dropdownMatchSelectWidth: false,
      maxTagCount: 3,
      searchable: true,
      flat: true,
      isFlat: true,
    },
    initial: true,
    optionQueryConfig: organizationsApiConfig.cooperationProjStatusList(),
  },
  {
    name: 'workGroupIds',
    type: 'FlatTreeSelect',
    optionsTextField: 'name',
    optionsValueField: 'id',
    fieldProps: {
      placeholder: '工作组',
      optionTooltip: 'overflow',
      multiple: true,
      dropdownMatchSelectWidth: false,
      maxTagCount: 3,
      searchable: true,
      optionRenderer: ({ text }:{text:string}) => <span className="tree-select-text">{text}</span>,
    },
    initial: true,
    optionQueryConfig: {
      ...organizationsApiConfig.getprojWorkGroup(),
      transformResponse: (res: any) => transformResponseTreeData(res, 'workGroupVOS'),
    },
    optionConfig: {
      idField: 'id',
      parentField: 'parentId',
    },
  },
  {
    name: 'projectClassficationIds',
    type: 'FlatTreeSelect',
    optionsTextField: 'name',
    optionsValueField: 'id',
    fieldProps: {
      placeholder: '项目分类',
      optionTooltip: 'overflow',
      multiple: true,
      dropdownMatchSelectWidth: false,
      maxTagCount: 3,
      searchable: true,
      onOption: nodeCover,
      optionRenderer: ({ text }:{text:string}) => <span className="tree-select-text">{text}</span>,
    },
    initial: true,
    optionQueryConfig: {
      ...organizationsApiConfig.getprojClassification(),
      transformResponse: (res: any) => transformResponseTreeData(res, 'treeProjectClassfication'),
    },
    optionConfig: {
      idField: 'id',
      parentField: 'parentId',
    },
  },
  {
    name: 'programIds',
    type: 'FlatSelect',
    fieldProps: {
      placeholder: '所属项目群',
      optionTooltip: 'overflow',
      multiple: true,
      dropdownMatchSelectWidth: false,
      maxTagCount: 3,
      searchable: true,
    },
    initial: true,
    optionQueryConfig: organizationsApiConfig.getprojPrograms(),
  },
  {
    name: 'categoryIds',
    type: 'FlatSelect',
    fieldProps: {
      placeholder: '项目类型',
      optionTooltip: 'overflow',
      multiple: true,
      dropdownMatchSelectWidth: false,
      maxTagCount: 3,
      searchable: true,
    },
    initial: true,
    optionQueryConfig: organizationsApiConfig.getprojType(),
  },
];
export const searchBusinessFieldsConfig = [
  ...searchFieldsConfig,
  {
    name: 'healthSateIds',
    type: 'FlatSelect',
    fieldProps: {
      placeholder: '健康状态',
      optionTooltip: 'overflow',
      multiple: true,
      dropdownMatchSelectWidth: false,
      // maxTagCount: 3,
      searchable: true,
    },
    initial: true,
    optionQueryConfig: iamApiConfig.getHealthStates(),
    optionConfig: {
      paging: false,
    },
  },

];

export const getFilterFieldsConfig = (orgId:string) => [
  {
    initial: false,
    checked: false,
    checkboxLabel: '创建人',
    name: 'createdBys',
    show: true,
    type: 'FlatSelect',
    fieldProps: {
      placeholder: '创建人',
      optionRenderer: userOptionRender,
      multiple: true,
      searchable: true,
      dropdownMatchSelectWidth: false,
      maxTagCount: 3,
      remoteSearch: true,
      remoteSearchName: 'params',
    },
    optionQueryConfig: organizationsApiConfig.getprojUsers(orgId),
    optionsTextField: 'realName',
  },
  {
    initial: false,
    checked: false,
    checkboxLabel: '创建时间',
    name: 'createTime',
    show: true,
    type: 'DateTimePicker',
    fieldProps: {
      placeholder: ['创建时间从', '至'],
      isFlat: true,
      range: true,
    },
  },
  {
    initial: false,
    checked: false,
    checkboxLabel: '更新人',
    name: 'lastUpdatedBys',
    show: true,
    type: 'FlatSelect',
    fieldProps: {
      placeholder: '更新人',
      optionRenderer: userOptionRender,
      multiple: true,
      searchable: true,
      dropdownMatchSelectWidth: false,
      maxTagCount: 3,
      remoteSearch: true,
      remoteSearchName: 'params',
    },
    optionQueryConfig: organizationsApiConfig.getprojUsers(orgId),
    optionsTextField: 'realName',
  },
  {
    initial: false,
    checked: false,
    checkboxLabel: '更新时间',
    name: 'updateTime',
    show: true,
    type: 'DateTimePicker',
    fieldProps: {
      placeholder: ['更新时间从', '至'],
      isFlat: true,
      range: true,
    },
  },
];

export const defaultColumnSetConfig = [
  {
    name: 'code',
    label: '项目编码',
    isSelected: true,
    order: 0,
  },
  {
    name: 'enabled',
    label: '项目状态',
    isSelected: true,
    order: 1,
  },
  {
    name: 'workGroup',
    label: '工作组',
    isSelected: true,
    order: 3,
  },
  {
    name: 'projectClassfication',
    label: '项目分类',
    isSelected: true,
    order: 4,
  },
  {
    name: 'programName',
    label: '所属项目群',
    isSelected: true,
    order: 5,
  },
  {
    name: 'categories',
    label: '项目类型',
    isSelected: true,
    order: 6,
  },
  {
    name: 'description',
    label: '项目描述',
    isSelected: true,
    order: 7,
  },
  {
    name: 'devopsComponentCode',
    label: 'DevOps组件编码',
    isSelected: false,
    order: 8,
  },
  {
    name: 'createUserName',
    label: '创建人',
    isSelected: false,
    order: 9,
  },
  {
    name: 'creationDate',
    label: '创建时间',
    isSelected: false,
    order: 10,
  },
  {
    name: 'updateUserName',
    label: '更新人',
    isSelected: false,
    order: 11,
  },
  {
    name: 'lastUpdateDate',
    label: '更新时间',
    isSelected: false,
    order: 12,
  },
];
export const defaultBusinessColumnSetConfig = [
  ...defaultColumnSetConfig,
  {
    name: 'healthState',
    label: '健康状态',
    isSelected: true,
    order: 2,
  },
];
