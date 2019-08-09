import React, { useContext, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Icon } from 'choerodon-ui';
import { Table } from 'choerodon-ui/pro';
import Store from '../stores';

const { Column } = Table;

const ListView = observer(({ context }) => {
  const { dataSet } = useContext(Store);

  function renderSelect({ record }) {
    const selected = record === dataSet.current;
    if (selected) {
      return <Icon type="check" style={{ color: '#3f51b5' }} />;
    }
    return null;
  }

  return (
    <Table dataSet={dataSet}>
      <Column renderer={renderSelect} width={50} />
      <Column name="name" />
      <Column name="code" />
    </Table>
  );
});

export default ListView;
