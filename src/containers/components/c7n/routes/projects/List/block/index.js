import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import Store from '../../stores';
import Card from './Card';

const ListView = observer((props) => {
  const { dataSet, isNotRecent, HeaderStore } = useContext(Store);

  function renderCard(record) {
    const cardPlainObj = record.toData();
    return <Card {...cardPlainObj} {...props} dataSet={dataSet} />;
  }

  function filterRecent(record) {
    if (isNotRecent) {
      return true;
    } else {
      const recents = HeaderStore.getRecentItem;
      return !!recents.find(v => v.id === record.get('id'));
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      {dataSet.filter(r => filterRecent(r)).map(r => renderCard(r))}
    </div>
  );
});

export default ListView;
