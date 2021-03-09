import React, { useCallback } from 'react';
import { Button, Table } from 'choerodon-ui/pro';
import { Tooltip } from 'choerodon-ui';
import { observer } from 'mobx-react-lite';
import UserInfo from '@/containers/components/c7n/components/user-info';
import { useApproveStore } from '../../stores';
import './ApproveTable.less';
import openApproveModal from '../approve-modal/ApproveModal';

const { Column } = Table;

const DemandTable = () => {
  const {
    approveListDs, demandDetailStore, AppState,
  } = useApproveStore();

  const { currentMenuType: { organizationId } } = AppState;

  const renderPriority = useCallback(({ value }) => {
    const { id, color, name } = value || {};
    return (id && (
      <span
        style={{
          backgroundColor: `${color}1F`,
          color,
          borderRadius: '2px',
          padding: '0 8px',
          display: 'inline-block',
          lineHeight: '19px',
        }}
      >
        {name}
      </span>
    )
    );
  }, []);

  const renderNode = useCallback(() => 'node', []);
  const renderProposer = useCallback(({ record }) => (
    <span style={{ display: 'flex', maxWidth: '100%' }}>
      <UserInfo {...(record?.get('creator') || {})} />
    </span>
  ), []);

  const renderApproveBtn = useCallback(({ record }) => (
    <div className="c7n-backlogApprove-table-approveBtn">
      <Button onClick={() => openApproveModal({ record, demandDetailStore, organizationId })}>审核</Button>
    </div>
  ), [demandDetailStore, organizationId]);

  return (
    <Table
      className="c7n-backlogApprove-table"
      dataSet={approveListDs}
      onRow={({ record }) => ({
        // className: record?.get('id') === store.selected ? 'selected' : null,
      })}
    >
      <Column
        name="summary"
        width={320}
        renderer={({ text, record }) => (
          <Tooltip title={text}>
            <span
              className="c7n-backlogApprove-table-summary"
              role="none"
              style={{
                cursor: 'pointer',
              }}
              // onClick={() => {
              //   if (record) {
              //     onClick(record.get('id'));
              //   }
              // }}
            >
              {text}
            </span>
          </Tooltip>
        )}
      />
      <Column
        name="node"
        renderer={renderNode}
        className="c7n-agile-table-cell"
      />
      <Column
        name="createdBy"
        renderer={renderProposer}
        className="c7n-agile-table-cell"
      />
      <Column
        name="backlogPriority"
        renderer={renderPriority}
      />
      <Column
        name="approveBtn"
        renderer={renderApproveBtn}
      />
    </Table>
  );
};

export default observer(DemandTable);
