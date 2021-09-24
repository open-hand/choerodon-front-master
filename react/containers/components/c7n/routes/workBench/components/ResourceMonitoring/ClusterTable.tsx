import React from 'react';
import { useHistory } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import { Table } from 'choerodon-ui/pro';
import Record from 'choerodon-ui/pro/lib/data-set/Record';
import { TableQueryBarType, TableColumnTooltip, TableAutoHeightType } from 'choerodon-ui/pro/lib/table/enum';
import { ColumnProps } from 'choerodon-ui/pro/lib/table/Column';
import AppState from '@/containers/stores/c7n/AppState';
import StatusTagOutLine from './StatusTagOutLine';
import useStore from './store';
import styles from './index.less';

interface K8STableProps {
  classNamePrefix: string;
}

function ClusterTable(props: K8STableProps) {
  const history = useHistory();
  const { clusterDataSet } = useStore();
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
        let nextValue = value;
        if (value === 'running') {
          nextValue = 'connected';
        }

        if (value === 'operating') {
          nextValue = 'processing';
        }

        return (
          <StatusTagOutLine status={nextValue} type="cluster" />
        );
      },
    },
    { name: 'creationDate' },
  ];

  // let containerHeight = 'auto';
  // const containerHeight = '50%';
  // let autoHeight: TableProps['autoHeight'] = false;

  // if (clusterDataSet.length >= 6) {
  //   // containerHeight = '300px';
  //   autoHeight = { type: TableAutoHeightType.minHeight, diff: 20 };
  // }

  return (
    <Table dataSet={clusterDataSet} columns={columns} queryBar={TableQueryBarType.none} autoHeight={{ type: TableAutoHeightType.minHeight, diff: 20 }} />
  );
}

export default observer(ClusterTable);
