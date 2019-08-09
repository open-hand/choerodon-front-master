import React, { useContext } from 'react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';
import { Icon } from 'choerodon-ui';
import Store from '../stores';
// import Card from './Card';

const ListView = observer(() => {
  const {
    dataSet, AppState,
    HeaderStore, MenuStore, history,
  } = useContext(Store);

  // function renderCard(record) {
  //   const cardPlainObj = record.toData();
  //   return <Card {...cardPlainObj} />;
  // }

  function handleClick(record) {
    const index = dataSet.findIndex(r => r === record);
    dataSet.locate(index);
  }

  function renderCard(record) {
    const idActive = record === dataSet.current;
    const classNames = classnames({
      card: true,
      active: idActive,
    });
    return (
      <div className={classNames} onClick={() => handleClick(record)}>
        <div className="card-body">
          <Icon type="playlist_add" style={{ color: '#3f51b5', fontSize: '64px' }} />
        </div>
        <div className="card-footer">{record.get('name')}</div>
        <div className="check-icon" style={{ display: idActive ? 'block' : 'none' }}>
          <Icon type="check" />
        </div>
      </div>
    );
  }

  return (
    <div className="create-project-tab-card-block">
      {dataSet.map(r => renderCard(r))}
    </div>
  );
});

export default ListView;
