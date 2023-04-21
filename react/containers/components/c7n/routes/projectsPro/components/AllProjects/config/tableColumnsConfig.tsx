import React from 'react';
import { Tag, Tooltip } from 'choerodon-ui';
import Record from 'choerodon-ui/pro/lib/data-set/Record';
import {
  StatusTag, HealthStatus, UserTag,
} from '@zknow/components';

const colorMap = new Map([
  ['failed', 'failed'],
  ['creating', 'operating'],
  ['updating', 'operating'],
]);

const getStatusName = (record: Record, formatMessage:any) => {
  const pData = record.toData();
  if (pData.projectStatus === 'failed') {
    return '创建失败';
  }
  if (pData.statusName) {
    return pData.statusName;
  }
  const getName = (p: any) => (
    // eslint-disable-next-line no-nested-ternary
    !p.projectStatus || p.projectStatus === 'success'
      ? p.enabled
        ? '启用'
        : '停用'
      : formatMessage({
        id: `c7ncd.project.${p.projectStatus}${p.projectStatus === 'failed'
          ? `.${p.operateType}`
          : ''
        }`,
      }));
  return getName(pData);
};

const getStatusColorCode = (record: Record) => {
  const p = record.toData();
  if (!p.projectStatus || p.projectStatus === 'success') {
    return p.enabled ? 'success' : 'failed';
  }
  return colorMap.get(p.projectStatus);
};

const getColor = (record: Record) => {
  const p = record.toData();
  if (['creating', 'updating', 'failed'].includes(p.projectStatus)) {
    return '';
  }
  return record?.get('color') || '';
};

const renderEnabled = (record :Record, formatMessage:any) => (
  <div style={{
    display: 'flex', justifyContent: 'left', height: '100%', alignItems: 'center',
  }}
  >
    <StatusTag
      color={getColor(record)}
    // @ts-ignore
      colorCode={getStatusColorCode(record)}
      name={getStatusName(record, formatMessage)}
    />
  </div>
);

const renderWorkGroup = ({ value, record }: { value: string, record: Record }) => {
  if (value) {
    if (value.indexOf('-') === -1) {
      return (
        <Tooltip title={value}>
          {value}
        </Tooltip>
      );
    }
    const strEnd = value.split('-').pop();
    return (
      <Tooltip title={value}>
        {strEnd}
      </Tooltip>
    );
  }
  return '';
};

const renderCategories = ({ value }: { value: any }) => {
  if (!value) {
    return '';
  }
  let title = '';
  value.forEach((i:any) => {
    title += `${i.name}，`;
  });
  return (
    <Tooltip title={title.substring(0, title.length - 1)}>
      <Tag
        key={value[0].name}
        className="categories-tag"
        color="rgba(15, 19, 88, 0.06)"
      >
        {value[0].name}
      </Tag>
      {
        value.length > 1
        && (
        <Tag
          key={value[1].name}
          className="categories-tag"
          color="rgba(15, 19, 88, 0.06)"
        >
          {`+${value.length - 1}`}
        </Tag>
        )
      }
    </Tooltip>
  );
};

const renderCreater = ({ record }: { record: Record }) => (
  <UserTag
    data={[
      {
        imageUrl: record?.get('createUserImageUrl'),
        realName: record?.get('createUserName'),
      },
    ]}
    style={{ maxWidth: '100%' }}
  />
);

const renderUpdater = ({ record }: { record: Record }) => (
  <UserTag
    data={[
      {
        imageUrl: record?.get('updateUserImageUrl'),
        realName: record?.get('updateUserName'),
      },
    ]}
    style={{ maxWidth: '100%' }}
  />
);

const renderHealthState = (record: Record, prefix:string) => {
  const { color, name, description } = record.get('healthStateDTO') || {};
  return <HealthStatus color={color} name={name} description={description} className={`${prefix}-healthStatus`} />;
};

export const renderUsers = ({ value }: { value:any }) => <UserTag data={value} style={{ maxWidth: '100%' }} />;

export const getAdjustableColumns = (formatMessage:any, prefix:string, fieldFunc: any) => [
  {
    name: 'name',
    sortable: true,
  },
  {
    name: 'code',
    tooltip: 'overflow' as any,
    sortable: true,
    align: 'left' as any,
    minWidth: 120,
  },
  {
    name: 'enabled',
    renderer: ({ record }: { record: Record }) => renderEnabled(record, formatMessage),
    sortable: true,
    align: 'left' as any,
    minWidth: 110,
  },
  {
    name: 'workGroup',
    renderer: renderWorkGroup,
    align: 'left' as any,
  },
  {
    name: 'projectClassfication',
    tooltip: 'overflow' as any,
    align: 'left' as any,
  },
  {
    name: 'programName',
    tooltip: 'overflow' as any,
    align: 'left' as any,
  },
  {
    name: 'categories',
    renderer: renderCategories,
    align: 'left' as any,
    minWidth: 140,
  },
  {
    name: 'description',
    tooltip: 'overflow' as any,
    align: 'left' as any,
  },
  {
    name: 'devopsComponentCode',
    tooltip: 'overflow' as any,
    align: 'left' as any,
    minWidth: 140,
  },
  {
    name: 'createUserName',
    renderer: renderCreater,
    align: 'left' as any,
  },
  {
    name: 'creationDate',
    tooltip: 'overflow' as any,
    align: 'left' as any,
    width: 155,
  },
  {
    name: 'updateUserName',
    renderer: renderUpdater,
    align: 'left' as any,
  },
  {
    name: 'lastUpdateDate',
    tooltip: 'overflow' as any,
    align: 'left' as any,
    width: 155,
  },
  {
    name: 'rank',
    renderer: ({ record }:{record:Record}) => renderHealthState(record, prefix),
    width: 155,
    lock: false,
    sortable: true,
  },
  ...fieldFunc ? fieldFunc.default() : [],
];
