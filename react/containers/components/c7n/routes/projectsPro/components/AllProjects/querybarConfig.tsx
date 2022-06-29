import React from 'react';
import Record from 'choerodon-ui/pro/lib/data-set/Record';
import { UserInfo } from '@choerodon/components';
import { organizationsApiConfig } from '@/apis';
import transformResponseTreeData from '@/utils/transformResponseTreeData';

const userOptionRender = ({ record }: { record: Record }) => (
  <UserInfo
    className="c7ncd-waterfall-deliverables-table-search-line-userinfo"
    loginName={record?.get('ldap') ? record?.get('loginName') : record?.get('email')}
    realName={record?.get('realName')}
    avatar={record?.get('imageUrl')}
  />
);

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

export const filterFieldsConfig = [
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
    optionQueryConfig: organizationsApiConfig.getprojUsers(),
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
    optionQueryConfig: organizationsApiConfig.getprojUsers(),
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
  },
  {
    name: 'enabled',
    label: '项目状态',
    isSelected: true,
  },
  {
    name: 'workGroup',
    label: '工作组',
    isSelected: true,
  },
  {
    name: 'projectClassfication',
    label: '项目分类',
    isSelected: true,
  },
  {
    name: 'programName',
    label: '所属项目群',
    isSelected: true,
  },
  {
    name: 'categories',
    label: '项目类型',
    isSelected: true,
  },
  {
    name: 'description',
    label: '项目描述',
    isSelected: true,
  },
  {
    name: 'devopsComponentCode',
    label: 'devops组件编码',
    isSelected: false,
  },
];
