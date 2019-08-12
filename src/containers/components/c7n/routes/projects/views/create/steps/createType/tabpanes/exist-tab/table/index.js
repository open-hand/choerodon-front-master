import React, { useContext, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Icon } from 'choerodon-ui';
import { Table } from 'choerodon-ui/pro';
import Store from '../stores';

const { Column } = Table;

const ListView = observer(() => {
  const { dataSet, context: { dataSet: outDs }, filter } = useContext(Store);

  function handleClickRow() {
    const createRecord = outDs.current;
    const currentValue = createRecord.get('createByExist');
    const selectedValue = dataSet.current.get('id');
    if (currentValue === selectedValue) {
      createRecord.set('createByExist', undefined);
      createRecord.set('category', 'AGILE');
    } else {
      createRecord.set('createByExist', selectedValue);
      createRecord.set('category', dataSet.current.get('category'));
    }
  }

  function handleRow() {
    return {
      onClick: handleClickRow,
    };
  }

  function renderSelect({ record }) {
    const selected = outDs.current.get('createByExist') === record.get('id');
    if (selected) {
      return <Icon type="check" style={{ color: '#3f51b5' }} />;
    }
    return null;
  }

  function tableFilter(record) {
    if (!filter) return true;
    return (record.get('name') || '').indexOf(filter) > -1 || (record.get('name') || '').indexOf(filter) > -1;
  }

  return (
    <Table dataSet={dataSet} onRow={handleRow} filter={tableFilter}>
      <Column renderer={renderSelect} width={50} />
      <Column name="name" />
      <Column name="code" />
    </Table>
  );
});

export default ListView;
