import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

import { Table } from 'choerodon-ui/pro';
import Record from 'choerodon-ui/pro/lib/data-set/Record';
import {
  TableQueryBarType, TableColumnTooltip, TableAutoHeightType, ColumnAlign,
} from 'choerodon-ui/pro/lib/table/enum';
import { ColumnProps } from 'choerodon-ui/pro/lib/table/Column';
import { StatusTag } from '@choerodon/components';

import AppState from '@/containers/stores/c7n/AppState';
import { statusKindMap, statusKindMapKey } from './common';
import useStore from './store';
import styles from './index.less';

interface HostTableProps {
  classNamePrefix: string;
}

export default function HostTable(props:HostTableProps) {
  const history = useHistory();
  const { hostDataSet } = useStore();
  const { classNamePrefix } = props;

  const handleGoToHost = (record:Record) => {
    history.push(`/devops/host-config?type=project&id=${record.get('projectId')}&name=${record.get('projectName')}&category=GENERAL&organizationId=${AppState.currentMenuType?.organizationId}`);
  };

  const columns:ColumnProps[] = [
    {
      name: 'name',
      renderer: ({ value, record }) => (
        // eslint-disable-next-line jsx-a11y/interactive-supports-focus,jsx-a11y/click-events-have-key-events
        <span
          role="link"
          className={styles[`${classNamePrefix}-link`]}
          onClick={() => handleGoToHost(record as Record)}
        >
          {value}
        </span>
      ),
      tooltip: TableColumnTooltip.overflow,
    },
    {
      name: 'cpu',
      renderer: ({ value }) => <Percent percent={value} />,
      align: ColumnAlign.left,
    },
    {
      name: 'mem',
      renderer: ({ value }) => <Percent percent={value} />,
      align: ColumnAlign.left,
    },
    {
      name: 'disk',
      renderer: ({ value }) => <Percent percent={value} />,
      align: ColumnAlign.left,
    },
    { name: 'hostIp', renderer: ({ value, record }) => `${value}:${record?.get('sshPort') ?? ''}`, tooltip: TableColumnTooltip.overflow },
    {
      name: 'hostStatus',
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
  ];

  return (
    <Table dataSet={hostDataSet} columns={columns} queryBar={TableQueryBarType.none} autoHeight={{ type: TableAutoHeightType.minHeight, diff: 20 }} />
  );
}

interface PercentProps {
  percent: number;
  highPercent?: number;
  empty?: React.ReactElement;
}

const Outer = styled.div`
    line-height: .4rem;
    text-align: left;
  `;

const Line = styled.div`
    display: flex;
    position: relative;
    width: 100%;
    height: 8px;
    background: rgba(15, 19, 88, 0.04);
    border-radius: 4px;
  `;

const Inner = styled.div`
    position: absolute;
    left: 0;
    height: 100%;
    background: #7d9dff;
    border-radius: 4px 0 0 4px;
  `;

const Blank = styled.span`
    z-index: 1;
    height: 100%;
    width: 1px;
    background: #fff;
    margin-left: calc(20% - 1px);
  `;

const Percent: React.FC<PercentProps> = (props) => {
  const {
    percent,
    highPercent = 80,
    empty = '- -',
  } = props;

  const percentText = `${percent?.toFixed(1) ?? 0}%`;

  if (percent === null || percent === undefined) return <Outer>{empty}</Outer>;

  return (
    <Outer>
      {percentText}
      <Line>
        <Inner
          style={{
            width: `${percent || 0}%`,
            borderTopRightRadius: percent === 100 ? '4px' : 0,
            borderBottomRightRadius: percent === 100 ? '4px' : 0,
            backgroundColor: percent > highPercent ? '#f55c6b' : '#7d9dff',
          }}
        />
        <Blank />
        <Blank />
        <Blank />
        <Blank />
      </Line>
    </Outer>
  );
};
