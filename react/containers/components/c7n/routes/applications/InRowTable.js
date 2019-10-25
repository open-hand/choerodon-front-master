import React from 'react';
import { Table } from 'choerodon-ui/pro';

const { Column } = Table;

export default function renderExpandRow(getDs, { record }) {
  const dataSet = getDs(record.get('id'));

  function renderType({ record: r }) {
    return r.get('type') === 'normal' ? '普通服务' : '测试服务';
  }

  return (
    <Table queryBar="none" dataSet={dataSet} className="app-inrow-table c7n-app-table">
      <Column name="name" />
      <Column name="code" />
      <Column name="type" renderer={renderType} />
    </Table>
  );
}
