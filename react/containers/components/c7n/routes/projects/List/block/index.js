import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import Store from '../../stores';
import Card from './Card';
import EmptyProject from '../EmptyProject';

const ListView = observer((props) => {
  const { dataSet, isNotRecent, HeaderStore, AppState, auto } = useContext(Store);

  function renderCard(record) {
    const cardPlainObj = record.toData();
    return <Card {...cardPlainObj} {...props} dataSet={dataSet} record={record} />;
  }

  function filterRecent(record) {
    if (isNotRecent === 'all') {
      return true;
    } else if (isNotRecent === 'recent') {
      const recents = HeaderStore.getRecentItem;
      return !!recents.find(v => v.id === record.get('id'));
    } else {
      return record.get('createdBy') === AppState.getUserId;
    }
  }

  const realData = dataSet.filter(r => filterRecent(r));

  if (realData.length === 0) {
    return <EmptyProject />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
      {realData.map(r => renderCard(r))}
    </div>
  );
});

export default ListView;
