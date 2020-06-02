import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import Store from '../../stores';
import Card from './Card';
import EmptyProject from '../../components/Empty';

const ListView = observer((props) => {
  const { dataSet, isNotRecent, HeaderStore, AppState, auto, history } = useContext(Store);

  function renderCard(record) {
    const cardPlainObj = record.toData();
    return <Card {...cardPlainObj} {...props} dataSet={dataSet} record={record} history={history} />;
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

  const realData = dataSet.originalData.filter(r => filterRecent(r));

  if (realData.length === 0 && dataSet.status === 'ready' && dataSet.queryDataSet.current && Object.keys(dataSet.queryDataSet.current.toData()).filter((item) => item !== '__dirty').length === 0) {
    let description = '';
    if (isNotRecent === 'all') {
      description = '暂无可操作的项目';
    } else if (isNotRecent === 'recent') {
      description = '暂无“最近使用”项目';
    } else if (isNotRecent === 'mine') {
      description = '暂无“我创建的” 项目';
    }
    return <EmptyProject title="暂无项目" description={description} />;
  } else if (realData.length === 0) {
    return (
      <div style={{ textAlign: 'center', marginTop: 100, color: 'rgba(0,0,0,0.65)' }}>
        暂无数据
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
      {realData.map(r => renderCard(r))}
    </div>
  );
});

export default ListView;
