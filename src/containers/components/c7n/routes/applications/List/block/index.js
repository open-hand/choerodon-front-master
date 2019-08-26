import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import Store from '../../stores';
import Card from './Card';

const ListView = observer((props) => {
  const { dataSet, isNotRecent, HeaderStore } = useContext(Store);

  function renderCard(record) {
    const cardPlainObj = record.toData();
    return <Card {...cardPlainObj} {...props} dataSet={dataSet} record={record} />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
      {dataSet.map(r => renderCard(r))}
    </div>
  );
});

export default ListView;
