import JSONBig from 'json-bigint';
import React from 'react';
import Record from 'choerodon-ui/pro/lib/data-set/Record';
import { UserInfo } from '@choerodon/components';
import { organizationsApiConfig } from '@/apis';

export const transformResponseTreeData = (res:any, attrName:string) => {
  try {
    const data = JSONBig.parse(res);

    if (data && data[attrName]) {
      const removeOrgItem = data[attrName].filter((item:any) => !(item.parentId === null && item.id === null));
      return removeOrgItem.map((item:any) => {
        if (item.id === null && item.parentId === 0) {
          return { ...item, id: '0', parentId: null };
        }
        return { ...item, parentId: item.parentId ? item.parentId : null };
      });
    }
    return data;
  } catch (error) {
    return res;
  }
};

const userOptionRender = ({ record }:{ record:Record}) => (
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
    type: 'Select',
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
    type: 'TreeSelect',
    width: 100,
    optionsTextField: 'name',
    optionsValueField: 'id',
    fieldProps: {
      placeholder: '工作组',
      optionTooltip: 'overflow',
      multiple: true,
      dropdownMatchSelectWidth: false,
      maxTagCount: 3,
      searchable: true,
      optionRenderer: ({ text }:{text:string}) => (
        <span className="tableAddFilter-tree-text">
          {text}
        </span>
      ),
    },
    initial: true,
    optionQueryConfig: {
      ...organizationsApiConfig.getprojWorkGroup(),
      transformResponse: (res:any) => transformResponseTreeData(res, 'workGroupVOS'),
    },
    optionConfig: {
      idField: 'id',
      parentField: 'parentId',
    },
  },
  {
    name: 'projectClassficationIds',
    type: 'TreeSelect',
    width: 100,
    optionsTextField: 'name',
    optionsValueField: 'id',
    fieldProps: {
      placeholder: '项目分类',
      optionTooltip: 'overflow',
      multiple: true,
      dropdownMatchSelectWidth: false,
      maxTagCount: 3,
      searchable: true,
      optionRenderer: ({ text }:{text:string}) => (
        <span className="tableAddFilter-tree-text">
          {text}
        </span>
      ),
    },
    initial: true,
    optionQueryConfig: {
      ...organizationsApiConfig.getprojClassification(),
      transformResponse: (res:any) => transformResponseTreeData(res, 'treeProjectClassfication'),
    },
    optionConfig: {
      idField: 'id',
      parentField: 'parentId',
    },
  },
  {
    name: 'programIds',
    type: 'Select',
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
    type: 'Select',
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
    type: 'Select',
    fieldProps: {
      placeholder: '创建人',
      optionRenderer: userOptionRender,
      multiple: true,
      clearButton: true,
      searchable: true,
      dropdownMatchSelectWidth: false,
      maxTagCount: 3,
      remoteSearch: true,
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
    type: 'Select',
    fieldProps: {
      placeholder: '更新人',
      optionRenderer: userOptionRender,
      multiple: true,
      clearButton: true,
      searchable: true,
      dropdownMatchSelectWidth: false,
      maxTagCount: 3,
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
