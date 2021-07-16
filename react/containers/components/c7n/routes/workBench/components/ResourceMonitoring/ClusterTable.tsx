import React from 'react';
import { useHistory } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import { DataSet, Table } from 'choerodon-ui/pro';
import Record from 'choerodon-ui/pro/lib/data-set/Record';
import { TableProps } from 'choerodon-ui/pro/lib/table/Table';
import { TableQueryBarType, TableColumnTooltip, TableAutoHeightType } from 'choerodon-ui/pro/lib/table/enum';
import { ColumnProps } from 'choerodon-ui/pro/lib/table/Column';
import { StatusTag } from '@choerodon/components';

import AppState from '@/containers/stores/c7n/AppState';
import { statusKindMap, statusKindMapKey } from './common';
import styles from './index.less';

const dataset = new DataSet({
  paging: false,
  autoQuery: true,
  selection: false,
  transport: {
    read: () => ({
      url: `devops/v1/organizations/${AppState.currentMenuType?.organizationId}/resource/cluster`,
      method: 'get',
    }),
  },
  fields: [
    { name: 'name', label: '主机名' },
    { name: 'status', label: '运行状态' },
    { name: 'creationDate', label: '创建时间' },
  ],
});

interface K8STableProps {
  classNamePrefix: string;
}

function ClusterTable(props: K8STableProps) {
  const history = useHistory();
  const { classNamePrefix } = props;

  // 跳转到集群管理页面
  const handleGoToCluster = (record: Record) => {
    history.push(`/devops/cluster-management?type=project&id=${record.get('projectId')}&name=${record.get('projectIdName')}&category=GENERAL&organizationId=${AppState.currentMenuType?.organizationId}`);
  };

  const columns :ColumnProps[] = [
    {
      name: 'name',
      renderer: ({ value, record }) => (
      // eslint-disable-next-line jsx-a11y/interactive-supports-focus,jsx-a11y/click-events-have-key-events
        <span
          role="link"
          className={styles[`${classNamePrefix}-link`]}
          onClick={() => handleGoToCluster(record as Record)}
        >
          {value}
        </span>
      ),
      tooltip: TableColumnTooltip.overflow,
    },
    {
      name: 'status',
      renderer: ({ value }) => {
        const {
          text, code,
        } = statusKindMap[value as statusKindMapKey] || {};

        return (
          <StatusTag
            type="border"
            name={text}
            colorCode={code}
          />
        );
      },
    },
    { name: 'creationDate' },
  ];

  // let containerHeight = 'auto';
  // const containerHeight = '50%';
  // let autoHeight: TableProps['autoHeight'] = false;

  // if (dataset.length >= 6) {
  //   // containerHeight = '300px';
  //   autoHeight = { type: TableAutoHeightType.minHeight, diff: 20 };
  // }

  return (
    <Table dataSet={dataset} columns={columns} queryBar={TableQueryBarType.none} autoHeight={{ type: TableAutoHeightType.minHeight, diff: 20 }} />
  );
}

export default observer(ClusterTable);
